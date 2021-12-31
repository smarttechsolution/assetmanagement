/*
 * <Asset Management Water System for managing water system assets like
 * finance, maintenance and supply by Community Level.>
 *     Copyright (C) <2021>  <Smart Tech Solution PVT. LTD.>
 *     This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *     This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Affero General Public License for more details.
 *     You should have received a copy of the GNU Affero General Public
 * License along with this program.  If not, see
 * <https://www.gnu.org/licenses/>.
 * Smart Tech Solution Pvt. Ltd.
 * Bhakti Thapa Sadak, New Baneshwor,
 * Kathmandu, Nepal
 * Tel: +977-01-5245027
 * Email: info@smarttech.com.np
 * Website: http://www.smarttech.com.np/
 */

package com.prologic.assetManagement.base

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.prologic.assetManagement.BuildConfig
import com.prologic.assetManagement.R
import com.prologic.assetManagement.util.createImageFile
import com.prologic.assetManagement.util.getFileFromUri
import com.prologic.assetManagement.util.showToast
import timber.log.Timber
import java.io.File

/**
 * [BaseDialogMultimediaFragment] for the dialog fragments which requires
 * user to either select or capture pictur
 */
open class BaseDialogMultimediaFragment : BaseDialog() {

    var listener: MultimediaListener? = null
    var photoPath: String? = null
    var selectedLog: String? = null


    private val requestMultiplePermissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->

        val grantedPermission = permissions.entries.filter { it.value == true }
        val rejectedPermission = permissions.entries.filter { it.value == false }

        Timber.d("the granted permission is:"+grantedPermission.size)
        Timber.d("the rejected permission is:"+rejectedPermission.size)
        if (grantedPermission.size == permissions.size) {
            capturePicture()

        } else if (rejectedPermission.isNotEmpty()) {
            showPermissionRequiredAlertDialog()
        }

    }

    val getImage = registerForActivityResult(ActivityResultContracts.GetContent()) {
        it?.let {
            Timber.d("the size of multiple uri list is:$it")
            photoPath = it.toString()
            val uri = Uri.parse(photoPath)
            val file = getFileFromUri(uri)
            listener?.onImageSelected(listOf(file))
        }
    }
    private val capturePicture = registerForActivityResult(ActivityResultContracts.TakePicture()) {

        if (it != null && it && photoPath != null) {
            val result = getFileFromUri(Uri.parse(photoPath))
            listener?.onImageSelected(listOf(result))

        }
    }


    /**
     * The server can only handle the total image size of 1 mb hence this condition
     */
    private fun isFileSizeCorrect(length: Long): Boolean {
        val fileSize = (length / 1024).toInt()
        Timber.d("the is:$fileSize")
        return fileSize <= 1024
    }

    private fun getFileFromUri(uri: Uri): File? {
        val file = requireContext().getFileFromUri(uri = uri)
        val fileSize = file.length()
        return if (isFileSizeCorrect(fileSize))
            file
        else {
            showToast(getString(R.string.error_file_should_be_small))
            null
        }
    }

    private val getImages =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            registerForActivityResult(ActivityResultContracts.GetMultipleContents()) {
                var length: Long = 0
                it?.let {
                    val result = it.map {
                        val file = getFileFromUri(it)
                        file?.let {
                            length = length + file.length()
                            it
                        }
                    }
                    val totalFileSize = (length / 1024).toInt()
                    if (totalFileSize <= 1024)
                        listener?.onImageSelected(result)
                    else
                        showToast(getString(R.string.error_file_should_be_small))

                }
            }
        } else {
            TODO("VERSION.SDK_INT < JELLY_BEAN_MR2")
        }


    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (this is MultimediaListener)
            listener = this
        else
            throw ClassCastException(this.toString() + " must implement MyInterface ")
    }


    /**
     *shows permission dialog if the permission is not given
     */
    private fun showPermissionRequiredAlertDialog() {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle(getString(R.string.error_permission_required))
            .setMessage(
                getString(R.string.error_permission_required_message)
            )
            .setNeutralButton(getString(R.string.action_confirm)) { dialog, which ->
                startActivity(
                    Intent(
                        Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                        Uri.parse("package:" + BuildConfig.APPLICATION_ID)
                    )
                )
            }
            .show()
    }


    fun launchImageSelection() {
        getImage.launch("image/*")
    }

    fun lunchMultipleImageSelections() {
        getImages.launch("image/*")
    }

    private fun checkPermissionForStorage() {
        when {
            ContextCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED && ContextCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.READ_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED
            -> {

                Timber.d("inside permissions are granted and waiting to launch")
                capturePicture()

            }


            shouldShowRequestPermissionRationale(Manifest.permission.WRITE_EXTERNAL_STORAGE) &&
                    shouldShowRequestPermissionRationale(Manifest.permission.READ_EXTERNAL_STORAGE)
            -> {
                Timber.d("inside show alert dialgo")

                showPermissionRequiredAlertDialog()

            }
            else -> {

                Timber.d("insiede laungch")
                requestMultiplePermissionsLauncher.launch(
                    arrayOf(
                        Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.READ_EXTERNAL_STORAGE
                    )
                )


            }
        }

    }


    fun launchCapturePicture() {
        checkPermissionForStorage()
    }

    private fun capturePicture() {
        requireContext().createImageFile().apply {
            val uri: Uri? = FileProvider.getUriForFile(
                requireContext(),
                BuildConfig.APPLICATION_ID + ".provider",
                this
            )
            photoPath = "file://" + this.absolutePath
            capturePicture.launch(uri)
        }
    }

    interface MultimediaListener {
        fun onImageSelected(selectedFile: List<File?>?)
    }

}


