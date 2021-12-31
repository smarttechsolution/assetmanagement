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

import com.google.gson.annotations.SerializedName
import java.util.*

data class UserToken(
    val accessToken: String,
    val refreshToken: String
)

data class LoginParam(
    @SerializedName("phone_number") val phoneNumber: String,
    @SerializedName("password") val password: String
)

data class LoginRes(
    @SerializedName("data") val loginResponse: LoginResponse
)

data class LoginResponse(
    @SerializedName("id") val id: String,
    @SerializedName("tokens") val tokenResponse: TokenResponse,
    @SerializedName("water_scheme") val waterScheme: String,
    @SerializedName("water_scheme_slug") val waterSchemeSlug: String,
    @SerializedName("name") val name: String,
    @SerializedName("phone_number") val number: String,
    @SerializedName("user_lang") val userLang:String,
    @SerializedName("system_date_format") val sysDateFormat:String

)
data class YearIntervalResponse(
    @SerializedName("id") val id:String,
    @SerializedName("start_date") val date:String,
    @SerializedName("end_date") val endDate:String,
    @SerializedName("year_num") val yearNo: String,
    @SerializedName("is_present_year") val isPresentYear:Boolean
)

data class YearInterval(
    val id:String,
    val startDate:String,
    val endDate: String,
    val yearNo:String
)



data class TokenResponse(
    @SerializedName("access") val accessToken: String,
    @SerializedName("refresh") val refresh: String
)

data class Auth(
    val isLoggedIn: Boolean,
    val userName: String?
)
data class User(
    val id: String,
    val name: String,
    val number: String,
    val waterSchemeSlug: String
)

enum class LANGUAGE{
    ENGLISH,NEPALI,SYS_DEFAULT
}
