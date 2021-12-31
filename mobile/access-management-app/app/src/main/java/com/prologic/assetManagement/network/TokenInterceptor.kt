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

package com.prologic.assetManagement.network

import android.text.TextUtils
import com.prologic.assetManagement.auth.data.AuthStore
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.auth.data.UserToken
import com.prologic.assetManagement.util.LocaleUtil
import com.prologic.assetManagement.util.Storage
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import okhttp3.Interceptor
import okhttp3.Request
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton
import okhttp3.HttpUrl
import timber.log.Timber


@Singleton
class TokenInterceptor @Inject constructor(val authStore: AuthStore): Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        return runBlocking {
             val token = authStore.getToken().firstOrNull()
            val lang = Storage(context = authStore.context).getPreferredLocale()
            val headerRequest : Request =
                if (token != null && !TextUtils.isEmpty(token.accessToken)) {

                    val urlBuilder = request.url.newBuilder()
                    val segments: List<String> = request.url.pathSegments
                     val mKey  = String.format("{%s}", "lang")
                    Timber.d("the key is:")
                    for (i in segments.indices) {
                        if (mKey==(segments[i])) {
                            urlBuilder.setPathSegment(i, LocaleUtil.getLanguageCodeApi(lang))
                        }
                    }
                 
                    request.newBuilder().url(urlBuilder.build())
                        .addHeader("Authorization", "Bearer ${token.accessToken}")
                        .addHeader("accept","application/json")
                        .build()


            }else{
                request.newBuilder().addHeader("accept","application/json").build()
            }
             val response = chain.proceed(headerRequest)
             return@runBlocking response
        }

    }
}