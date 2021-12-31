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

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.ConcatAdapter
import com.prologic.assetManagement.R
import com.prologic.assetManagement.databinding.FragmentCashbookBinding
import com.prologic.assetManagement.databinding.FragmentNotificationBinding
import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.show
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber

@AndroidEntryPoint
class NotificationFragment : Fragment() {

    val viewmodel : NotificationViewModel by viewModels()

    private var _binding: FragmentNotificationBinding? = null
    private val binding get() = _binding!!


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentNotificationBinding.inflate(inflater,container,false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewmodel.notifications.observe(viewLifecycleOwner, Observer {
            if (it != null){
                binding.pbNotification.hide()
                if (it.isNotEmpty()) {
                    binding.tvNotificationError.hide()
                    val items = it.groupBy { it.categoryId }
                    val adapters: List<NotificationAdapter> = items.entries.map {
                        val notificationAdapter = NotificationAdapter()
                        notificationAdapter.submitList(it.value)
                        notificationAdapter
                    }
                    val concatAdapter = ConcatAdapter(adapters)
                    binding.rvNotifications.adapter = concatAdapter
                }else{
                    binding.tvNotificationError.show()
                }
            }
        })


    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}