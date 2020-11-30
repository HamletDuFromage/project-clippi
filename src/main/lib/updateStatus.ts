import { Message, UpdateStatus } from "common/types";
import { sendMessage } from "./sendMessage";
import clean from "semver/functions/clean";
import { needsUpdate } from "common/githubReleaseVersions";

function sendVersionUpdateStatus(status: UpdateStatus, payload?: any) {
  sendMessage(Message.VersionUpdateStatus, {
    status,
    payload,
  });
}

export function sendLatestVersion(version: string) {
  const versionString = clean(version) || version;
  const payload = {
    version: versionString,
    lastChecked: new Date().toISOString(),
  };
  if (needsUpdate(versionString)) {
    sendVersionUpdateStatus(UpdateStatus.UPDATE_AVAILABLE, payload);
  } else {
    sendVersionUpdateStatus(UpdateStatus.NO_UPDATE, payload);
  }
}

export function sendDownloadComplete() {
  sendVersionUpdateStatus(UpdateStatus.DOWNLOAD_COMPLETE);
}

export function sendUpdateError(message: string) {
  sendVersionUpdateStatus(UpdateStatus.UPDATE_ERROR, message);
}