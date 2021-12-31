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

package com.prologic.assetManagement.maintenance

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.R
import com.prologic.assetManagement.databinding.ItemMaintenanceBinding
import com.prologic.assetManagement.maintenance.data.Maintenance
import com.prologic.assetManagement.maintenance.data.MaintenanceComponent
import com.prologic.assetManagement.util.*

class MaintenanceAdapter (val clickListener : (Maintenance) -> Unit): ListAdapter<Maintenance,MaintenanceAdapter.MaintenanceViewHolder>(object: DiffUtil.ItemCallback<Maintenance>(){
    override fun areItemsTheSame(oldItem: Maintenance, newItem: Maintenance): Boolean {
        return oldItem.component.id == newItem.component.id
    }

    override fun areContentsTheSame(oldItem: Maintenance, newItem: Maintenance): Boolean {
        return oldItem == newItem
    }

}) {

    inner class MaintenanceViewHolder (val binding: ItemMaintenanceBinding): RecyclerView.ViewHolder(binding.root){
        fun bind(maintenance: Maintenance){
            binding.ivMaintenance.loadCircularImage(maintenance.picture)
            binding.tvCost.setAmount(maintenance.estCost)
            binding.tvInterval.setInterval( maintenance.interval)
            binding.tvRiskScore.setRiskScore(maintenance.riskScore)
            binding.tvLogEntries.setText(binding.tvLogEntries.context.getString(R.string.maintenance_log_entries)+maintenance.logEntry)
            binding.tvTitle.setText(maintenance.component.name)
            binding.tvDate.setText(binding.tvDate.context.getString(R.string.maintenance_action_date) +maintenance.actionDate)

            itemView.setOnClickListener {
                clickListener(maintenance)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MaintenanceViewHolder {
       val view = ItemMaintenanceBinding.inflate(LayoutInflater.from(parent.context),parent,false)
        return MaintenanceViewHolder(view)
    }

    override fun onBindViewHolder(holder: MaintenanceViewHolder, position: Int) {
        val item = getItem(position)
        item?.let {
            holder.bind(it)
        }
    }

}