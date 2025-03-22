import { APP_BASE_URL } from "./constants";

export function getSubmissionUrl(formId: string) {
    const url = new URL(`/api/submit/${formId}`, APP_BASE_URL);
    return url.toString();
}