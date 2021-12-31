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

package com.prologic.assetManagement.notification.data

import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.notification.data.remote.RemoteNotificationSource
import javax.inject.Inject

class NotificationRepository @Inject constructor(
    private val remoteCashbookSource: RemoteNotificationSource
    ):INotificationRepository{
    override suspend fun getNotifications(): List<Notification> {

        val notifications = mutableListOf<Notification>()
        when(val response = remoteCashbookSource.getNotifications()){
            is ResponseWrapper.Success->{
                response.value.mapIndexed { index, notification ->
                    if (index == 0 || index == 1){
                        notification.categoryId = "1"
                        notification.categoryName = "New"

                    }else{
                        notification.categoryId = "2"
                        notification.categoryName = "Earlier"
                    }
                    notifications.add(notification)
                }
              }
            else -> {

            }
        }
        return notifications
    }
}