/********************************************************************************
 * Copyright (c) 2021, 2023 BMW Group AG
 * Copyright (c) 2021, 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import {
  DropAreaProps,
  DropPreviewProps,
  DropPreviewFileProps,
  DropStatusHeaderProps,
  UploadFile,
  deleteConfirmOverlayTranslation,
  DropArea as DefaultDropArea,
  DropPreview as DefaultDropPreview,
  UploadStatus,
} from 'cx-portal-shared-components'
import { FunctionComponent, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

export type DropzoneFile = File & Partial<UploadFile>

export interface DropzoneProps {
  onChange: (
    allFiles: DropzoneFile[],
    addedFiles: DropzoneFile[] | undefined,
    deletedFiles: DropzoneFile[] | undefined
  ) => void
  files?: DropzoneFile[]
  acceptFormat?: any
  maxFilesToUpload?: number
  maxFileSize?: number

  DropArea?: FunctionComponent<DropAreaProps> | false
  DropStatusHeader?: FunctionComponent<DropStatusHeaderProps> | false
  DropPreview?: FunctionComponent<DropPreviewProps> | false
  DropPreviewFile?: FunctionComponent<DropPreviewFileProps> | false
  enableDeleteIcon?: boolean
  enableDeleteOverlay?: boolean
  deleteOverlayTranslation?: deleteConfirmOverlayTranslation
}

export const Dropzone = ({
  onChange,
  files,
  acceptFormat,
  maxFilesToUpload,
  maxFileSize,
  DropArea,
  DropStatusHeader,
  DropPreview,
  DropPreviewFile,
  enableDeleteIcon = true,
  enableDeleteOverlay = false,
  deleteOverlayTranslation,
}: DropzoneProps) => {
  const { t } = useTranslation()

  const [dropped, setDropped] = useState<DropzoneFile[]>([])

  const currentFiles = files ?? dropped

  const isSingleUpload = maxFilesToUpload === 1

  const isDisabled = isSingleUpload
    ? false
    : currentFiles.length === maxFilesToUpload

  const onDropAccepted = useCallback(
    (droppedFiles: File[]) => {
      const nextFiles = isSingleUpload
        ? droppedFiles
        : [...dropped, ...droppedFiles]

      setDropped(nextFiles)
      onChange(nextFiles, droppedFiles, undefined)
    },
    [dropped, isSingleUpload, onChange]
  )

  const handleDelete = useCallback(
    (deleteIndex) => {
      const nextFiles = [...currentFiles]
      const deletedFiles = nextFiles.splice(deleteIndex, 1)

      setDropped(nextFiles)
      onChange(nextFiles, undefined, deletedFiles)
    },
    [currentFiles, onChange]
  )

  const {
    getRootProps,
    getInputProps,
    fileRejections,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDropAccepted,
    disabled: isDisabled,
    maxFiles: isSingleUpload ? 0 : maxFilesToUpload,
    accept: acceptFormat,
    multiple: !isSingleUpload,
    maxSize: maxFileSize,
  })

  let DropAreaComponent = DefaultDropArea
  if (DropArea) {
    DropAreaComponent = DropArea
  } else if (DropArea === false) {
    DropAreaComponent = () => null
  }

  let DropPreviewComponent = DefaultDropPreview
  if (DropPreview) {
    DropPreviewComponent = DropPreview
  } else if (DropPreview === false) {
    DropPreviewComponent = () => null
  }

  // TODO: read react-dropzone errorCode instead of message and localize
  const errorMessage =
    !isDragActive && fileRejections?.[0]?.errors?.[0]?.message

  const uploadFiles: UploadFile[] = currentFiles.map((file) => ({
    name: file.name,
    size: file.size,
    status: file.status ?? UploadStatus.NEW,
    progressPercent: file.progressPercent,
  }))

  return (
    <div>
      <div {...getRootProps()}>
        <DropAreaComponent
          disabled={isDisabled}
          error={errorMessage || isDragReject}
          translations={{
            title: t('shared.dropzone.title'),
            subTitle: t('shared.dropzone.subTitle'),
            errorTitle: t('shared.dropzone.errorTitle'),
          }}
        >
          <input {...getInputProps()} />
        </DropAreaComponent>
      </div>

      <DropPreviewComponent
        uploadFiles={uploadFiles}
        onDelete={handleDelete}
        DropStatusHeader={DropStatusHeader}
        DropPreviewFile={DropPreviewFile}
        translations={{
          placeholder: t('shared.dropzone.placeholder'),
          uploadError: t('shared.dropzone.uploadError'),
          uploadSuccess: t('shared.dropzone.uploadSuccess'),
          uploadProgess: t('shared.dropzone.uploadProgess'),
        }}
        enableDeleteIcon={enableDeleteIcon}
        enableDeleteOverlay={enableDeleteOverlay}
        deleteOverlayTranslation={deleteOverlayTranslation}
      />
    </div>
  )
}