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
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.R
import com.prologic.assetManagement.cashbook.data.CashbookTotal
import com.prologic.assetManagement.databinding.ItemCashbookTotalBinding

import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.show

class CashbookTotalAdapter() :
    ListAdapter<List<CashbookTotal>, CashbookTotalAdapter.CashbookHeaderViewHolder>(object :
        DiffUtil.ItemCallback<List<CashbookTotal>>() {
        override fun areItemsTheSame(
            oldItem: List<CashbookTotal>,
            newItem: List<CashbookTotal>
        ): Boolean {
            return oldItem.joinToString { "," } == newItem.joinToString { "," }
        }

        override fun areContentsTheSame(
            oldItem: List<CashbookTotal>,
            newItem: List<CashbookTotal>
        ): Boolean {
            return oldItem == newItem
        }

    }) {

    inner class CashbookHeaderViewHolder(
        val binding: ItemCashbookTotalBinding,
        val inflater: LayoutInflater
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bindView(cashbookTotals: List<CashbookTotal>) {
            binding.llCashbookTotal.removeAllViews()
            cashbookTotals.map {
                val child = inflater.inflate(R.layout.item_cashbook_total_child, binding.root,false)
                child.findViewById<TextView>(R.id.tvCashbookCategory1).text = it.category
                child.findViewById<TextView>(R.id.tvCashbookAmount1).text = it.total
                binding.llCashbookTotal.addView(child)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CashbookHeaderViewHolder {
        val inflater: LayoutInflater = LayoutInflater.from(parent.context)
        val view = ItemCashbookTotalBinding.inflate(inflater, parent, false)
        return CashbookHeaderViewHolder(view, inflater)
    }

    override fun onBindViewHolder(holder: CashbookHeaderViewHolder, position: Int) {
        val item = getItem(position)
        item?.let {
            holder.bindView(it)
        }
    }


}