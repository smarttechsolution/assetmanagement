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

package com.prologic.assetManagement.maintenance.ui.log

import android.net.Uri
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.net.toUri
import androidx.core.view.ViewCompat.canScrollVertically
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.R
import com.prologic.assetManagement.base.BaseDialog
import com.prologic.assetManagement.base.BaseDialogMultimediaFragment
import com.prologic.assetManagement.databinding.FragmentMaintenanceDetailDialogBinding
import com.prologic.assetManagement.databinding.FragmentMaintenanceLogDialogBinding
import com.prologic.assetManagement.maintenance.MaintenanceViewModel
import com.prologic.assetManagement.maintenance.data.MaintenanceLog
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber
import java.io.File
import java.util.*


@AndroidEntryPoint
class MaintenanceLogDialogFragment : BaseDialogMultimediaFragment(),
    BaseDialogMultimediaFragment.MultimediaListener {


    val args: MaintenanceLogDialogFragmentArgs by navArgs()

    private val maintenanceViewModel: MaintenanceViewModel by hiltNavGraphViewModels(R.id.navigation_maintenance)
    private var _binding: FragmentMaintenanceLogDialogBinding? = null
    private val binding get() = _binding!!
   private  lateinit var adapter: MaintenanceLogAdapter
    private val layoutManager: LinearLayoutManager = object : LinearLayoutManager(context) {
        override fun canScrollHorizontally(): Boolean {
            return false
        }

        override fun canScrollVertically(): Boolean {
            return true
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentMaintenanceLogDialogBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

         adapter = MaintenanceLogAdapter(args.isEditable) { action: String, maintenanceLog: MaintenanceLog ->

            when (action) {
                "save" -> {
                    showProgressDialog(getString(R.string.loader_saving))
                    maintenanceViewModel.createMaintenance(maintenanceLog)
                }
                "update" -> {
                    showProgressDialog(getString(R.string.loader_updating))
                    maintenanceViewModel.updateMaintenance(maintenanceLog)

                }
                "captureImage"->{
                    selectedLog = maintenanceLog.id
                    launchCapturePicture()
                }
                "cancel" -> dismiss()
                "selectImage" -> {
                    selectedLog = maintenanceLog.id
                    launchImageSelection()
                }
                "selectDate" -> showDatePicker {
                    setDateValue(maintenanceLog, it)
                }
            }
        }
        maintenanceViewModel._logPosition.postValue(0)
        layoutManager.orientation = LinearLayoutManager.HORIZONTAL
        binding.rvLogs.layoutManager = layoutManager
        binding.rvLogs.adapter = adapter


        maintenanceViewModel.logs.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                adapter.submitList(it)
            }
        })

        maintenanceViewModel.logPosition.observe(viewLifecycleOwner, Observer { pos ->
            if (pos != null) {
                binding.tvEntriesCount.text =
                    (pos + 1).toString() + " " + getString(R.string.extra_of) + " " + maintenanceViewModel.totalLogs

            }
        })

        maintenanceViewModel.logActionResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                hideProgressDialog()
                when (it) {
                    is ResponseWrapper.Success -> {
                        showToast("Success")

                    }
                    is ResponseWrapper.GenericError -> {
                        showToast("" + it.error?.message)

                    }
                    is ResponseWrapper.NetworkError -> {
                        showToast("Error")
                    }
                    is ResponseWrapper.NoConnectionError-> requireContext().showNoConnectionErrorDialog()

                }
                maintenanceViewModel._logActionResponse.postValue(null)
            }
        })


        binding.btnLeft.setOnClickListener {
            openPreviousPage()
        }

        binding.btnRight.setOnClickListener {
            openNextPage()
        }


    }

    private fun openPreviousPage() {
        val pos = maintenanceViewModel.logPosition.value
        pos?.let {
            if (pos > 0) {
                layoutManager.scrollToPosition(pos - 1)
                maintenanceViewModel._logPosition.postValue(pos - 1)
            }
        }
    }

    private fun openNextPage() {
        val pos = maintenanceViewModel.logPosition.value
        val totalLogs = maintenanceViewModel.totalLogs
        pos?.let {
            if (pos < totalLogs - 1) {
                layoutManager.scrollToPosition(it + 1)
                maintenanceViewModel._logPosition.postValue(it + 1)
                //   layoutManager.smoothScrollToPosition(binding.rvLogs,RecyclerView.State(),1)
            }
        }
    }


    fun setDateValue(maintenanceLog: MaintenanceLog, date: String) {
        val items = maintenanceViewModel.logs.value
        items?.let {
            val item = items.find { maintenanceLog.id == it?.id }
            item?.selectedDate = date
            adapter.submitList(it.toMutableList())
        }
    }

    override fun onImageSelected(selectedFile: List<File?>?) {
        selectedFile?.get(0)?.let { file ->
            val items = maintenanceViewModel.logs.value
            items?.let {
                val item = items.find { selectedLog == it?.id }
                item?.picture = file.toUri().toString()
                item?.pictureFile = file
                adapter.submitList(it.toMutableList())
            }
        }
    }


}