#!/usr/bin/env bash
# =============================================================================
# Cloud Run Deployment Script — Gemini 3.8 Flash TTS Voice Studio
# =============================================================================
# Usage:
#   ./deploy.sh [PROJECT_ID] [REGION] [SERVICE_NAME]
#
# Examples:
#   ./deploy.sh
#   ./deploy.sh llm-project-52521 us-central1 gemini-voice-studio
# =============================================================================

set -euo pipefail

# 1. Resolve Project ID (CLI arg -> Env var -> ADC quota project -> gcloud config)
PROJECT_ID="${1:-${GOOGLE_CLOUD_PROJECT:-}}"

if [[ -z "${PROJECT_ID}" ]]; then
  ADC_FILE="${HOME}/.config/gcloud/application_default_credentials.json"
  if [[ -f "${ADC_FILE}" ]]; then
    PROJECT_ID=$(python3 -c "import json; print(json.load(open('${ADC_FILE}')).get('quota_project_id', ''))" 2>/dev/null || true)
  fi
fi

if [[ -z "${PROJECT_ID}" ]]; then
  PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)
fi

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "ERROR: No Google Cloud Project ID found."
  echo "Run: ./deploy.sh <YOUR_PROJECT_ID> [REGION] [SERVICE_NAME]"
  exit 1
fi

REGION="${2:-${REGION:-us-central1}}"
SERVICE_NAME="${3:-${SERVICE_NAME:-gemini-voice-studio}}"

echo "=================================================================="
echo " Deploying Gemini 3.8 Flash TTS Voice Studio to Cloud Run"
echo "------------------------------------------------------------------"
echo " Project ID   : ${PROJECT_ID}"
echo " Region       : ${REGION}"
echo " Service Name : ${SERVICE_NAME}"
echo "=================================================================="

# 2. Enable required Google Cloud APIs
echo "-> Enabling required Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  --project="${PROJECT_ID}"

# 3. Grant Vertex AI User role to the default compute service account (if permitted)
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)" 2>/dev/null || true)
if [[ -n "${PROJECT_NUMBER}" ]]; then
  COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
  echo "-> Ensuring Cloud Run service account (${COMPUTE_SA}) has roles/aiplatform.user..."
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${COMPUTE_SA}" \
    --role="roles/aiplatform.user" \
    --condition=None \
    --quiet >/dev/null 2>&1 || echo "   (Skipped IAM binding — verify service account has Vertex AI User role if needed)"
fi

# 4. Build and Deploy to Cloud Run from source
echo "-> Building container and deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=${PROJECT_ID}"

# 5. Output the deployed Service URL
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --format "value(status.url)")

echo ""
echo "=================================================================="
echo " Deployment Complete!"
echo " Live Studio URL: ${SERVICE_URL}"
echo "=================================================================="
