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

package com.prologic.assetManagement.maintenance.ui.notScheduled;

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.core.net.toUri
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.navArgs
import com.prologic.assetManagement.R
import com.prologic.assetManagement.base.BaseDialogMultimediaFragment
import com.prologic.assetManagement.databinding.FragmentAddUnscheduledDialogBinding
import com.prologic.assetManagement.maintenance.data.Maintenance
import com.prologic.assetManagement.maintenance.data.MaintenanceLog
import com.prologic.assetManagement.maintenance.data.getMaintenanceLog
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import timber.log.Timber
import java.io.File

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link AddNotScheduledMaintenanceFragment#} factory method to
 * create an instance of this fragment.
 */
class AddUnScheduledLogDialogFragment : BaseDialogMultimediaFragment(),
    AdapterView.OnItemSelectedListener, BaseDialogMultimediaFragment.MultimediaListener {

    private var _binding: FragmentAddUnscheduledDialogBinding? = null
    private val binding get() = _binding!!
    private val viewModel: NotScheduledViewModel by hiltNavGraphViewModels(R.id.navigation_maintenance)

    val args: AddUnScheduledLogDialogFragmentArgs by navArgs()

    var log: MaintenanceLog? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAddUnscheduledDialogBinding.inflate(inflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setUpLogTypeSpinner()
        viewModel.getUnscheduledMaintenanceLogs(args.rangeId, "not-schedule")

        viewModel.addLogResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                hideProgressDialog()
                viewModel._addLogResponse.postValue(null)
                when (it) {
                    is ResponseWrapper.Success -> {
                        showToast(getString(R.string.response_save_data_success))
                        dismiss()
                    }
                    is ResponseWrapper.NoConnectionError -> {
                        requireContext().showNoConnectionErrorDialog()
                    }
                    is ResponseWrapper.NetworkError -> {
                        showToast(getString(R.string.error_server))

                    }
                    is ResponseWrapper.GenericError -> {
                        showToast(it.error?.message)

                    }
                }
            }
        })

        binding.btnClose.setOnClickListener {
            dismiss()
        }
        binding.btnSaveLog.setOnClickListener {
            log?.let {
                it.intervalDay = binding.etMaintenanceInterval.text.toString()
                it.totalCost = binding.etTotalPrice.text.toString()
                it.remarks = binding.etMaintenanceRemarks.text.toString()
                it.possibleSolution = binding.etMaintenanceSolution.text.toString()
                it.failureReason = binding.etMaintenanceProblem.text.toString()

                if (binding.cbAddExtraCost.isChecked) {
                    it.totalCost = "0"
                    it.materialCost = binding.etMaterial.text.toString()
                    it.labourCost = binding.etLabour.text.toString()
                    it.replacementCost = binding.etReplacementCost.text.toString()
                } else {
                    it.totalCost = binding.etTotalPrice.text.toString()
                    it.materialCost = null
                    it.labourCost = null
                    it.replacementCost = null
                }


                Timber.d("the log is:" + it)

                when {
                    it.selectedDate.isNullOrEmpty() -> showToast(getString(R.string.unscheduled_maintenance_date_empty))
                    it.totalCost.isNullOrEmpty() -> showToast(getString(R.string.unscheduled_maintenance_add_cost))
                    it.intervalDay.isNullOrEmpty() -> showToast(getString(R.string.unscheduled_duration_empty))
                    it.logType.isNullOrEmpty() -> showToast(getString(R.string.unscheduled_log_type_empty))
                    else -> {
                        showProgressDialog(getString(R.string.loader_saving))
                        viewModel.saveMaintenanceLog(it)
                    }
                }

            } ?: showToast(getString(R.string.unscheduled_maintenance_log_required))
        }



        viewModel.unscheduledMaintenanceLogs.observe(viewLifecycleOwner, Observer {
            if (!it.isNullOrEmpty()) {

                val namesList: MutableList<String> = it.map { it.component.name }.toMutableList()
                Timber.d("the names list is:" + namesList.size)
                namesList.add(0, getString(R.string.unscheduled_maintenance_log_entry_title))

                Timber.d("the size now is:" + namesList.size)
                val spinnerAdapter: ArrayAdapter<String> = object : ArrayAdapter<String>(
                    requireContext(),
                    R.layout.item_simple_spinner,
                    namesList
                ) {

                    override fun isEnabled(position: Int): Boolean {
                        return position != 0
                    }

                    override fun getDropDownView(
                        position: Int, convertView: View?,
                        parent: ViewGroup?
                    ): View? {
                        val view = super.getDropDownView(position, convertView, parent)
                        val tv = view as TextView
                        if (position == 0) {
                            // Set the hint text color gray
                            tv.setTextColor(Color.GRAY)
                        } else {
                            tv.setTextColor(Color.BLACK)
                        }
                        return view
                    }
                }
                binding.spinnerMaintenanceLogs.onItemSelectedListener = this
                binding.spinnerMaintenanceLogs.adapter = spinnerAdapter

            }
        })

        binding.cbAddExtraCost.setOnCheckedChangeListener { compoundButton, b ->
            if (b) {
                binding.etTotalPrice.setText("")
                binding.groupExtraCost.show()
                binding.etTotalPrice.hide()
            } else {
                binding.etLabour.setText("")
                binding.etMaterial.setText("")
                binding.etReplacementCost.setText("")
                binding.groupExtraCost.hide()
                binding.etTotalPrice.show()
            }
        }
        binding.btnSelectPicture.setOnClickListener {
            launchImageSelection()
        }
        binding.btnCapturePicture.setOnClickListener {
            launchCapturePicture()
        }
        binding.btnShowDate.setOnClickListener {
            log?.let { l ->
                showDatePicker {
                    l.selectedDate = it
                    binding.btnShowDate.text = it
                }
            } ?: showToast(getString(R.string.unscheduled_maintenance_log_required))
        }
    }

    override fun onItemSelected(p0: AdapterView<*>?, p1: View?, position: Int, p3: Long) {
        when (p0?.id) {
            R.id.spinnerMaintenanceLogs -> {

                if (position > 0) {
                    (p0!!.getChildAt(0) as TextView).setTextColor(Color.BLACK)
                    val categoryList: List<Maintenance>? = viewModel.unscheduledMaintenanceLogs.value
                    val item = categoryList?.elementAt(position - 1)
                    item?.let {
                        viewModel.selectedMaintenance = it
                        log = getMaintenanceLog(
                            componentId = it.id,
                            componentName = it.component.name,
                            possibleFailure = it.possibleFailure,
                            possibleSolution = it.logEntry
                        ).also { newlog ->
                            // log?.id = it.id
                            //  newlog.serverId = it.id
                            // binding.etMaintenanceProblem.setText(it.possibleFailure)
                            //binding.etMaintenanceSolution.setText(it.action)
                            // binding.etMaintenanceInterval.setText(it.interval)

                        }


                    }
                } else {
                    viewModel.selectedMaintenance = null
                }
            }

            R.id.spinnerLogType -> {
                if (position > 0) {
                    (p0!!.getChildAt(0) as TextView).setTextColor(Color.BLACK)
                    if (position == 1) {
                        log?.logType = "Maintenance"
                    } else if (position == 2) {
                        log?.logType = "Issue"
                    }

                } else {
                    log?.logType = null
                }
            }
        }

    }

    override fun onNothingSelected(p0: AdapterView<*>?) {

    }


    override fun onImageSelected(selectedFile: List<File?>?) {
        selectedFile?.get(0)?.let { file ->
            log?.let {
                val uri = file.toUri()
                it.picture = uri.toString()
                it.pictureFile = file
                binding.ivSelectedImage.setImageURI(uri)
            }

        }
    }

    private fun setUpLogTypeSpinner() {

        val logTypeSpinnerAdapter: ArrayAdapter<String> = object : ArrayAdapter<String>(
            requireContext(),
            R.layout.item_simple_spinner,
            resources.getStringArray(R.array.array_unscheduled_log_type)
        ) {

            override fun isEnabled(position: Int): Boolean {
                return position != 0
            }

            override fun getDropDownView(
                position: Int, convertView: View?,
                parent: ViewGroup?
            ): View? {
                val view = super.getDropDownView(position, convertView, parent)
                val tv = view as TextView
                if (position == 0) {
                    // Set the hint text color gray
                    tv.setTextColor(Color.GRAY)
                } else {
                    tv.setTextColor(Color.BLACK)
                }
                return view
            }
        }
        binding.spinnerLogType.onItemSelectedListener = this
        binding.spinnerLogType.adapter = logTypeSpinnerAdapter

    }
}