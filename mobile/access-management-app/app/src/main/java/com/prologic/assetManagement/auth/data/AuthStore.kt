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

package com.prologic.assetManagement.auth.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.prologic.assetManagement.util.LocaleUtil
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.runBlocking
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

 val Context.dataStore: DataStore<Preferences> by preferencesDataStore("assetManagement")


/*
*Uses data store to cache the user login information like: tokens, slugs, number,name
*
*
*/

@Singleton
class AuthStore @Inject constructor(@ApplicationContext val context: Context) {

    fun isLoggedIn(): Flow<Auth> = context.dataStore.data.mapLatest {
        val userId: String? = it[ACCESS_TOKEN]
        val userName: String? = it[NAME]
        Auth(userId.isNullOrEmpty(), userName)
    }


    suspend fun clearToken() {
        context.dataStore.edit {
            it[ACCESS_TOKEN] = ""
        }
    }


    fun getToken(): Flow<UserToken?> = context.dataStore.data.map { pref ->
             pref[ACCESS_TOKEN]?.let {
                UserToken(
                    accessToken = it,
                    refreshToken = pref[REFRESH_TOKEN]!!
                )
            }

    }


    fun getUser(): Flow<User?> = context.dataStore.data.map { pref ->
        pref[USER_ID]?.let {
            User(
                name = pref[NAME] ?: "",
                number = pref[PHONE_NUMBER] ?: "",
                waterSchemeSlug = pref[WATER_SCHEME_SLUG] ?: "",
                id = pref[USER_ID] ?: ""
            )
        }
    }


    suspend fun saveUserInfo(loginResponse: LoginResponse) {
        context.dataStore.edit {
            it[USER_ID] = loginResponse.id
            it[ACCESS_TOKEN] = loginResponse.tokenResponse.accessToken
            it[REFRESH_TOKEN] = loginResponse.tokenResponse.refresh
            it[WATER_SCHEME] = loginResponse.waterScheme
            it[WATER_SCHEME_SLUG] = loginResponse.waterSchemeSlug
            it[NAME] = loginResponse.name
            it[PHONE_NUMBER] = loginResponse.number

        }
    }


    companion object {
        val USER_ID = stringPreferencesKey("user_id")
        val ACCESS_TOKEN = stringPreferencesKey("access_token")
        val REFRESH_TOKEN = stringPreferencesKey("refresh_token")
        val WATER_SCHEME = stringPreferencesKey("water_scheme")
        val WATER_SCHEME_SLUG = stringPreferencesKey("water_scheme_slug")
        val NAME = stringPreferencesKey("name")
        val PHONE_NUMBER = stringPreferencesKey("phone_number")


    }
}


