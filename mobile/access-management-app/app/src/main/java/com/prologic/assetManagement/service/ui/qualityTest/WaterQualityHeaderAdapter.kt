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

package com.prologic.assetManagement.service.ui.qualityTest

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.databinding.ItemWaterQualityHeaderBinding
import com.prologic.assetManagement.databinding.ItemWaterQualityParameterBinding
import com.prologic.assetManagement.service.data.WaterQualityParameter
import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.show

class WaterQualityHeaderAdapter(
    var fromDate: String?,
    var toDate: String?,
    val clickListener: (Boolean) -> Unit
) : RecyclerView.Adapter<WaterQualityHeaderAdapter.WaterQualityHeaderViewHolder>() {

    inner class WaterQualityHeaderViewHolder(val binding: ItemWaterQualityHeaderBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind() {

            binding.cbToggleDates.setOnCheckedChangeListener { compoundButton, b ->
                if (b)
                    binding.btnShowToDate.show()
                else
                    binding.btnShowToDate.hide()
            }

            binding.btnShowFromDate.setOnClickListener {
                clickListener(true)
            }
            binding.btnShowToDate.setOnClickListener {
                clickListener(false)
            }


            fromDate?.let { binding.btnShowFromDate.text = fromDate }
            toDate?.let {
                binding.cbToggleDates.isChecked = true
                binding.btnShowToDate.text = toDate
            }

        }

        fun resetForm() {
            binding.cbToggleDates.isChecked = false
            binding.btnShowFromDate.text = ""
            binding.btnShowToDate.text = ""
            fromDate = null
            toDate = null

        }
    }

    fun setStartDate(date: String) {
        fromDate = date
        notifyItemChanged(0)

    }

    fun setEndDate(date: String) {
        toDate = date
        notifyItemChanged(0)

    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): WaterQualityHeaderViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val view = ItemWaterQualityHeaderBinding.inflate(inflater, parent, false)
        return WaterQualityHeaderViewHolder(view)
    }

    override fun onBindViewHolder(holder: WaterQualityHeaderViewHolder, position: Int) {
        holder.bind()
    }

    override fun getItemCount(): Int {
        return 1
    }
}