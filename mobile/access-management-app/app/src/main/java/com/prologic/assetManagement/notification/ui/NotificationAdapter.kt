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

package com.prologic.assetManagement.notification.ui

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.databinding.ItemNotificationBinding
import com.prologic.assetManagement.databinding.ItemNotificationGroupBinding
import com.prologic.assetManagement.notification.data.Notification
import com.prologic.assetManagement.util.getServerDateFormat


class NotificationAdapter :
    ListAdapter<Notification, NotificationAdapter.NotificationViewHolder>(object :
        DiffUtil.ItemCallback<Notification>() {
        override fun areItemsTheSame(oldItem: Notification, newItem: Notification): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Notification, newItem: Notification): Boolean {
            return oldItem == newItem
        }

    }) {

    companion object {
        private const val VIEW_TYPE_ITEM = 1
        private const val VIEW_TYPE_HEADER = 2
    }


    sealed class NotificationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        class NotificationBodyViewHolder(val binding: ItemNotificationBinding) :
            NotificationViewHolder(binding.root) {

            fun bind(notification: Notification, position: Int) {

                if (position % 2 != 0) {
                    binding.clParent.setBackgroundColor(Color.parseColor("#F5F5F6"))
                } else {
                    binding.clParent.setBackgroundColor(Color.parseColor("#ffffff"))
                }

                when (notification.title) {
                   "SERVICE","Service" -> binding.ivNotificationCategory.setImageResource(
                        R.drawable.ic_service_round
                    )
                   "Maintenance","MAINTENANCE"-> binding.ivNotificationCategory.setImageResource(
                        R.drawable.ic_maintainence_round
                    )
                   "Income","INCOME","Expenditure","EXPENDITURE","EXPENSE","Expense" -> binding.ivNotificationCategory.setImageResource(R.drawable.ic_cashbook_round)
                }

                if (AssetManagementApp.userPreference==LANGUAGE.NEPALI) {
                    binding.tvNotificationTitle.text = notification.titleNp
                    binding.tvNotificationBody.text = notification.messageNp
                }else{
                    binding.tvNotificationTitle.text = notification.title
                    binding.tvNotificationBody.text = notification.message

                }
                binding.tvNotificationDate.text = notification.date.getServerDateFormat()

            }
        }

        class NotificationHeaderViewHolder(val binding: ItemNotificationGroupBinding) :
            NotificationViewHolder(binding.root) {
            fun bind(value: String) {
                binding.tvNotificationTitle.text = value
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            VIEW_TYPE_HEADER -> NotificationViewHolder.NotificationHeaderViewHolder(
                ItemNotificationGroupBinding.inflate(inflater, parent, false)
            )
            else -> NotificationViewHolder.NotificationBodyViewHolder(
                ItemNotificationBinding.inflate(inflater, parent, false)
            )
        }
    }

    override fun onBindViewHolder(holder: NotificationViewHolder, position: Int) {
        when (holder) {
            is NotificationViewHolder.NotificationHeaderViewHolder -> {
                val item = getItem(position)
                item?.let {
                    holder.bind(it.categoryName)
                }

            }

            is NotificationViewHolder.NotificationBodyViewHolder -> {
                val item = getItem(position - 1)
                item?.let {
                    holder.bind(it, position)
                }
            }
        }
    }

    override fun getItemViewType(position: Int): Int {
        return if (position == 0) VIEW_TYPE_HEADER else VIEW_TYPE_ITEM
    }

    override fun getItemCount(): Int {
        return super.getItemCount() + 1
    }

}