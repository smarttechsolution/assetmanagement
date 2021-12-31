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

package com.prologic.assetManagement

import android.app.Application
import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey

import com.google.firebase.messaging.FirebaseMessaging
import com.prologic.assetManagement.auth.data.Auth
import com.prologic.assetManagement.auth.data.AuthStore
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.auth.data.dataStore
import com.prologic.assetManagement.util.LocaleUtil
import com.prologic.assetManagement.util.Storage
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import timber.log.Timber
import javax.inject.Inject

@HiltAndroidApp
class AssetManagementApp : Application() {

    @Inject
    lateinit var authStore: AuthStore

    companion object {
        lateinit var sysLanguage: LANGUAGE
        lateinit var userPreference: LANGUAGE
    }

    override fun onCreate() {
        super.onCreate()
        if (BuildConfig.DEBUG)
            Timber.plant(Timber.DebugTree())

        FirebaseMessaging.getInstance().subscribeToTopic("hello")
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Timber.d("success")
                 }
               }


        runBlocking {
            val data = applicationContext.dataStore.data.first()
            val ACCESS_TOKEN = stringPreferencesKey("access_token")
            if (data.contains(ACCESS_TOKEN) && !data[ACCESS_TOKEN].isNullOrEmpty()) {
                applicationContext.dataStore.edit {
                    it[ACCESS_TOKEN] = ""
                }
            }
        }
    }


    override fun attachBaseContext(base: Context) {
        val storage = Storage(base)
        sysLanguage = storage.getSysLocale()
        userPreference = storage.getPreferredLocale()
        Timber.d("the sys locale is:" + sysLanguage)
        super.attachBaseContext(LocaleUtil.getLocalizedContext(base, storage.getPreferredLocale()))
    }


}

