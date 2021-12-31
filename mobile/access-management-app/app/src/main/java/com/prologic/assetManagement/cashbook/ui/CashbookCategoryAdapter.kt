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
import com.prologic.assetManagement.cashbook.data.CashbookCategory
import com.prologic.assetManagement.databinding.ItemCashbookCategoryBinding

class CashbookCategoryAdapter() :ListAdapter<CashbookCategory,CashbookCategoryAdapter.CashbookCategoryViewHolder>(object: DiffUtil.ItemCallback<CashbookCategory>(){
    override fun areItemsTheSame(oldItem: CashbookCategory, newItem: CashbookCategory): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: CashbookCategory, newItem: CashbookCategory): Boolean {
        return oldItem == newItem
    }

}){

    inner class CashbookCategoryViewHolder(private val binding:ItemCashbookCategoryBinding) : RecyclerView.ViewHolder(binding.root){

        fun bindView(cashbookCategory:CashbookCategory){
            binding.tvCashbookTitle.text = cashbookCategory.name

        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CashbookCategoryViewHolder {
        val view = ItemCashbookCategoryBinding.inflate(LayoutInflater.from(parent.context),parent,false)
        return CashbookCategoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: CashbookCategoryViewHolder, position: Int) {
        val item = getItem(position)
        item?.let {
            holder.bindView(it)
        }
    }


}