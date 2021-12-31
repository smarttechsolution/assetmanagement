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

package com.prologic.assetManagement.auth.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.prologic.assetManagement.databinding.ItemNumberDialBinding


/**
 * Adapter for the list of numbers in the login page
 * @param lists which consists of numbers 0-9 and < which means back space and an OK button
 * @param clickListener for handling the clik on the list item
 */
class NumberDialAdapter (val lists:List<String>,val clickListener : (String) -> Unit ): RecyclerView.Adapter<NumberDialAdapter.NumberDialViewHolder>(){

   inner class NumberDialViewHolder(val view: ItemNumberDialBinding) : RecyclerView.ViewHolder(view.root){
        fun bind(item:String){

            view.btnNumberDial.text = item
            itemView.setOnClickListener { clickListener(item) }
        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NumberDialViewHolder {
       val view = ItemNumberDialBinding.inflate(LayoutInflater.from(parent.context),parent,false)
        return  NumberDialViewHolder(view)
    }

    override fun onBindViewHolder(holder: NumberDialViewHolder, position: Int) {
     holder.bind(item = lists.get(position))
    }

    override fun getItemCount(): Int {
        return  lists.size
    }
}