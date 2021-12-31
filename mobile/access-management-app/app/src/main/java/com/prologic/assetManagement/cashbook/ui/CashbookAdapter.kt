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

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.cashbook.data.Cashbook
import com.prologic.assetManagement.cashbook.data.CashbookCategory
import com.prologic.assetManagement.cashbook.data.CashbookUiModel
import com.prologic.assetManagement.databinding.ItemCashbookBinding
import com.prologic.assetManagement.databinding.ItemCashbookCategoryBinding
import com.prologic.assetManagement.databinding.ItemCashbookDateBinding
import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.setAmount
import com.prologic.assetManagement.util.show

class CashbookAdapter(val clickListener: (String, Cashbook) -> Unit) :
    ListAdapter<CashbookUiModel, CashbookAdapter.CashbookViewHolder>(object :
        DiffUtil.ItemCallback<CashbookUiModel>() {
        override fun areItemsTheSame(
            oldItem: CashbookUiModel,
            newItem: CashbookUiModel
        ): Boolean {

            return if (oldItem is CashbookUiModel.CashbookInfoUiModel &&
                newItem is CashbookUiModel.CashbookInfoUiModel
            )
                oldItem.cashbook.id == newItem.cashbook.id
            else if (oldItem is CashbookUiModel.CashbookCategoryUiModel &&
                newItem is CashbookUiModel.CashbookCategoryUiModel
            )
                oldItem.cashbookCategory.id == newItem.cashbookCategory.id
            else if (oldItem is CashbookUiModel.CashbookDateUiModel &&
                newItem is CashbookUiModel.CashbookDateUiModel
            )
                oldItem.cashbookDate == newItem.cashbookDate
            else
                true

        }


        var selectedPos = -1

        override fun areContentsTheSame(
            oldItem: CashbookUiModel,
            newItem: CashbookUiModel
        ): Boolean {
            return oldItem == newItem
        }


    }) {


    sealed class CashbookViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        class CashbookItemViewHolder(private val binding: ItemCashbookBinding) : CashbookViewHolder(binding.root) {
            val group = binding.groupCashbookAction
            fun bind(cashbook: Cashbook, position: Int, clickListener: (String, Cashbook) -> Unit) {
                if (position % 2 == 0) {
                    binding.clParent.setBackgroundColor(Color.parseColor("#F5F5F6"))
                } else {
                    binding.clParent.setBackgroundColor(Color.parseColor("#ffffff"))
                }

                itemView.setOnClickListener {
                    if (binding.groupCashbookAction.visibility == View.VISIBLE)
                       group.hide()
                    else {

                        binding.groupCashbookAction.postDelayed(object :Runnable{
                            override fun run() {
                                group.hide()
                            }
                        },3000)
                       group.show()
                    }
                }

                binding.btnEdit.setOnClickListener {
                    clickListener("edit", cashbook)
                }
                binding.btnDelete.setOnClickListener {
                    binding.groupCashbookAction.hide()
                    // deleteCashbook(cashbook)
                    clickListener("delete", cashbook)
                }

                binding.tvCashbookDescription.text = cashbook.title
                binding.tvCashbookAmount.setAmount(cashbook.amount)
                binding.tvCashbookDate.text = cashbook.date
            }
        }

        class CashbookCategoryViewHolder(private val binding: ItemCashbookCategoryBinding) :
            CashbookViewHolder(binding.root) {

            fun bindView(cashbookCategory: CashbookCategory) {
                binding.tvCashbookTitle.text = cashbookCategory.name

            }
        }

        class CashbookDateViewHolder(private val binding: ItemCashbookDateBinding) :
            CashbookViewHolder(binding.root) {
            fun bindView(date: String) {
                binding.tvShowDate.text = date
            }
        }

    }


    override fun onBindViewHolder(holder: CashbookViewHolder, position: Int) {
        val item = getItem(position)
        item?.let { uiModel ->
            when (uiModel) {
                is CashbookUiModel.CashbookInfoUiModel -> {
                    (holder as CashbookViewHolder.CashbookItemViewHolder).bind(
                        uiModel.cashbook,
                        position,
                        clickListener
                    )
                }
                is CashbookUiModel.CashbookCategoryUiModel -> {
                    (holder as CashbookViewHolder.CashbookCategoryViewHolder).bindView(uiModel.cashbookCategory)
                }
                is CashbookUiModel.CashbookDateUiModel -> {
                    (holder as CashbookViewHolder.CashbookDateViewHolder).bindView(uiModel.cashbookDate)
                }
            }
        }
    }

    override fun onViewDetachedFromWindow(holder: CashbookViewHolder) {
        if (holder is CashbookViewHolder.CashbookItemViewHolder){
            if (holder.group.visibility  == View.VISIBLE){
                holder.group.hide()
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CashbookViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            R.layout.item_cashbook_category -> CashbookViewHolder.CashbookCategoryViewHolder(
                ItemCashbookCategoryBinding.inflate(inflater, parent, false)
            )
            R.layout.item_cashbook -> CashbookViewHolder.CashbookItemViewHolder(
                ItemCashbookBinding.inflate(
                    inflater,
                    parent,
                    false
                )
            )
            else -> CashbookViewHolder.CashbookDateViewHolder(
                ItemCashbookDateBinding.inflate(
                    inflater,
                    parent,
                    false
                )
            )
        }
    }

    override fun getItemViewType(position: Int): Int {
        return when (getItem(position)) {
            is CashbookUiModel.CashbookCategoryUiModel -> R.layout.item_cashbook_category
            is CashbookUiModel.CashbookInfoUiModel -> R.layout.item_cashbook
            is CashbookUiModel.CashbookDateUiModel -> R.layout.item_cashbook_date
        }
    }


}