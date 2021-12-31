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

package com.prologic.assetManagement.cashbook.ui


import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.R
import com.prologic.assetManagement.cashbook.data.CashbookToggle
import com.prologic.assetManagement.databinding.ItemToggleCashbookBinding
import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.invisible
import com.prologic.assetManagement.util.show

class CashbookToggleAdapter(val clickListener :(String)->Unit) :
    ListAdapter<CashbookToggle, CashbookToggleAdapter.CashbookToggleViewHolder>(object :
        DiffUtil.ItemCallback<CashbookToggle>() {
        override fun areItemsTheSame(oldItem: CashbookToggle, newItem: CashbookToggle): Boolean {
            return oldItem.isWeek == newItem.isWeek || oldItem.title == newItem.title
        }

        override fun areContentsTheSame(oldItem: CashbookToggle, newItem: CashbookToggle): Boolean {
            return oldItem == newItem
        }

    }) {

    inner class CashbookToggleViewHolder(val binding: ItemToggleCashbookBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(cashbookToggle: CashbookToggle) {
            binding.labelCashbookTotal.text = cashbookToggle.title

            cashbookToggle.isWeek?.let {
                if (!it){
                    binding.groupToggleWeek.hide()
                }else{
                    binding.groupToggleWeek.show()
                }
                binding.btnSwapWeekMonth.show()
                binding.btnSwapWeekMonth.setOnClickListener {
                    clickListener("swap")
                }
                binding.btnLeft.setOnClickListener {
                    clickListener("left")
                }
                binding.btnRight.setOnClickListener {
                    clickListener("right")
                }
                if (cashbookToggle.isWeek) {
                    binding.btnSwapWeekMonth.text =
                        binding.btnSwapWeekMonth.context.getString(R.string.extra_month)
                } else {
                    binding.btnSwapWeekMonth.text =
                        binding.btnSwapWeekMonth.context.getString(R.string.extra_week)
                }
            }

            if(cashbookToggle.isWeek == null){
                binding.groupToggleWeek.hide()
                binding.btnSwapWeekMonth.hide()
            }


        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CashbookToggleViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val item = ItemToggleCashbookBinding.inflate(inflater, parent, false)
        return CashbookToggleViewHolder(item)
    }

    override fun onBindViewHolder(holder: CashbookToggleViewHolder, position: Int) {
        val item = getItem(position)
        item?.let{
            holder.bind(it)
        }

    }
}