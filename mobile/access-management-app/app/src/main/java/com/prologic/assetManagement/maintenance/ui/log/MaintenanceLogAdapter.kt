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
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.datepicker.CalendarConstraints
import com.google.android.material.datepicker.MaterialDatePicker
import com.prologic.assetManagement.R
import com.prologic.assetManagement.databinding.ItemMaintenanceLogBinding
import com.prologic.assetManagement.maintenance.data.MaintenanceLog
import com.prologic.assetManagement.util.*
import java.util.*


class MaintenanceLogAdapter(val isEditable:Boolean,val clickListener: (String, MaintenanceLog) -> Unit) :
    ListAdapter<MaintenanceLog, MaintenanceLogAdapter.MaintenanceLogViewHolder>(object :
        DiffUtil.ItemCallback<MaintenanceLog>() {
        override fun areItemsTheSame(oldItem: MaintenanceLog, newItem: MaintenanceLog): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: MaintenanceLog, newItem: MaintenanceLog): Boolean =
            false

        override fun getChangePayload(oldItem: MaintenanceLog, newItem: MaintenanceLog): Any? {
            val diffBundle = Bundle()
            diffBundle.putString(BUNDLE_PICTURE, newItem.picture)
            diffBundle.putString(BUNDLE_DATE, newItem.selectedDate)
            return diffBundle
        }

    }) {

    companion object {
        val BUNDLE_PICTURE: String = "BUNDLE_PICTURE"
        val BUNDLE_DATE: String = "BUNDLE_DATE"
    }

    inner class MaintenanceLogViewHolder(val binding: ItemMaintenanceLogBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(log: MaintenanceLog) {

            binding.etMaintenanceProblem.setText(log.failureReason)
            binding.etMaintenanceSolution.setText(log.possibleSolution)
            if (isEditable){
                binding.etMaintenanceProblem.isEnabled = true
                binding.etMaintenanceSolution.isEnabled = true
            }else{
                binding.etMaintenanceProblem.isEnabled = false
                binding.etMaintenanceSolution.isEnabled = false
            }

            binding.tvMaintenanceLogTitle.text = log.componentName

            binding.etTotalPrice.setText(  log.totalCost)

            binding.etMaintenanceInterval.setText(log.intervalDay)
            binding.etMaintenanceRemarks.setText(log.remarks)
            binding.btnShowDate.text = log.selectedDate

            if(log.totalCost == "0.0"){
                binding.groupExtraCost.show()
                binding.etTotalPrice.hide()
                binding.etMaterial.setText(  log.materialCost)
                binding.etReplacementCost.setText(  log.replacementCost)
                binding.etLabour.setText(  log.labourCost)
            }else{
                binding.groupExtraCost.hide()
                binding.etTotalPrice.show()
                binding.etTotalPrice.setText( log.totalCost)
            }

            if (log.serverId == null) {
                binding.btnSaveLog.text =
                    binding.btnSaveLog.context.getString(R.string.action_save_log)
            } else {
                binding.btnSaveLog.text =
                    binding.btnSaveLog.context.getString(R.string.action_update_log)
            }

            log.picture?.let {
                if (!it.startsWith("http"))
                    binding.ivSelectedImage.setImageURI(Uri.parse(it))
                else
                    binding.ivSelectedImage.loadImage(it)
            }
            binding.btnClose.setOnClickListener {
                clickListener("cancel", log)
            }
            binding.btnSelectPicture.setOnClickListener {
                clickListener("selectImage", log)
            }
            binding.btnCapturePicture.setOnClickListener {
                clickListener("captureImage",log)
            }
            binding.btnShowDate.setOnClickListener {
                clickListener("selectDate", log)
            }

            binding.cbAddExtraCost.setOnCheckedChangeListener { compoundButton, b ->
                if (b) {
                    binding.etTotalPrice.setText("")
                    binding.groupExtraCost.show()
                    binding.etTotalPrice.hide()
                }
                else {
                    binding.etLabour.setText("")
                    binding.etMaterial.setText("")
                    binding.etReplacementCost.setText("")
                    binding.groupExtraCost.hide()
                    binding.etTotalPrice.show()
                }
            }



            binding.btnSaveLog.setOnClickListener {

                log.intervalDay = binding.etMaintenanceInterval.text.toString()
                log.totalCost = binding.etTotalPrice.text.toString()
                log.remarks = binding.etMaintenanceRemarks.text.toString()
                if (isEditable) {
                    log.possibleSolution = binding.etMaintenanceSolution.text.toString()
                    log.failureReason = binding.etMaintenanceProblem.text.toString()
                }
                if(binding.cbAddExtraCost.isChecked){
                    log.isCostSegregated = true
                    log.totalCost = "0"
                    log.materialCost = binding.etMaterial.text.toString()
                    log.labourCost = binding.etLabour.text.toString()
                    log.replacementCost = binding.etReplacementCost.text.toString()
                }else{
                    log.isCostSegregated = false
                    log.totalCost = binding.etTotalPrice.text.toString()
                    log.materialCost = null
                    log.labourCost = null
                    log.replacementCost = null
                }

                log.logType = "Maintenance"

                if (log.serverId == null)
                    clickListener("save", log)
                else
                    clickListener("update", log)
            }
        }

    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MaintenanceLogViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val binding = ItemMaintenanceLogBinding.inflate(inflater, parent, false)
        return MaintenanceLogViewHolder(binding)
    }

    override fun onBindViewHolder(
        holder: MaintenanceLogViewHolder,
        position: Int,
        payloads: MutableList<Any>
    ) {
        if (payloads.isEmpty()) {
            super.onBindViewHolder(holder, position, payloads)
            return
        }
        payloads.forEach {
            when (it) {
                is Bundle -> {
                    it.getString(BUNDLE_PICTURE)?.let {
                        holder.binding.ivSelectedImage.setImageURI(Uri.parse(it))

                    }
                    it.getString(BUNDLE_DATE).let {
                        holder.binding.btnShowDate.text = it
                    }

                }
            }

        }
    }

    override fun onBindViewHolder(holder: MaintenanceLogViewHolder, position: Int) {
        val item = getItem(position)
        item?.let {
            holder.bind(it)
        }
    }


}