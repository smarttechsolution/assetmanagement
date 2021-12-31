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
import androidx.core.widget.doOnTextChanged
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.databinding.ItemWaterQualityParameterBinding
import com.prologic.assetManagement.service.data.WaterQualityParameter
import com.prologic.assetManagement.util.afterTextChanged

class WaterQualityParameterAdapter(val updateListener: (WaterQualityParameter) -> Unit) :
    ListAdapter<WaterQualityParameter,WaterQualityParameterAdapter.WaterQualityParameterViewHolder>(object : DiffUtil.ItemCallback<WaterQualityParameter>(){
        override fun areItemsTheSame(
            oldItem: WaterQualityParameter,
            newItem: WaterQualityParameter
        ): Boolean {
            return  oldItem.id == newItem.id
        }

        override fun areContentsTheSame(
            oldItem: WaterQualityParameter,
            newItem: WaterQualityParameter
        ): Boolean {
            return  oldItem == newItem
        }

    }) {

    inner class WaterQualityParameterViewHolder(val binding: ItemWaterQualityParameterBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(waterQualityParameter: WaterQualityParameter) {
            binding.etQualityParameter.setText(waterQualityParameter.value)
            binding.etQualityParameter.hint = waterQualityParameter.name
            binding.labelUnit.text = waterQualityParameter.unit
            binding.etQualityParameter.afterTextChanged {text->
                    if (text.isNotEmpty()) {
                        waterQualityParameter.value = text
                        updateListener(waterQualityParameter)
                }
            }



        }
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): WaterQualityParameterViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val view = ItemWaterQualityParameterBinding.inflate(inflater, parent, false)
        return WaterQualityParameterViewHolder(view)
    }

    override fun onBindViewHolder(holder: WaterQualityParameterViewHolder, position: Int) {
        val item = getItem(position)
        item?.let{
            holder.bind(it)
        }


    }


}