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

package com.prologic.assetManagement.util

import android.content.Context
import android.content.SharedPreferences
import android.content.res.Configuration
import android.content.res.Resources
import android.os.Build
import android.os.LocaleList
import androidx.core.os.ConfigurationCompat
import com.prologic.assetManagement.auth.data.LANGUAGE
import org.intellij.lang.annotations.Language
import java.util.*


class LocaleUtil {


    companion object {
        val supportedLocales = LANGUAGE.values()

        /**
         * returns the locale to use depending on the preference value
         * when preference value = "sys_def" returns the locale of current system
         * else it returns the locale code e.g. "en", "bn" etc.
         */
        fun getLocaleFromPrefCode(language: LANGUAGE): Locale {
            val localeCode = if (language != LANGUAGE.SYS_DEFAULT) {
                getLanguageCode(language)
            } else {
                val systemLang = ConfigurationCompat.getLocales(Resources.getSystem().configuration)
                    .get(0).language
                if (systemLang == "ne") {
                    "ne"
                } else {
                    "en"
                }
            }
            return Locale(localeCode)
        }

        fun getLocaleFromSystem(): Locale {
            val systemLang = ConfigurationCompat.getLocales(Resources.getSystem().configuration)
                .get(0).language
            val code = if (systemLang == "ne")
                "ne"
            else
                "en"
            return Locale(code)
        }

        fun getLocalizedConfiguration(prefLocaleLanguage: LANGUAGE): Configuration {
            val locale = getLocaleFromPrefCode(prefLocaleLanguage)
            return getLocalizedConfiguration(locale)
        }

        fun getLocalizedConfiguration(locale: Locale): Configuration {
            val config = Configuration()
            return config.apply {
                config.setLayoutDirection(locale)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    config.setLocale(locale)
                    val localeList = LocaleList(locale)
                    LocaleList.setDefault(localeList)
                    config.setLocales(localeList)
                } else {
                    config.setLocale(locale)
                }
            }
        }

        fun getLocalizedContext(baseContext: Context, prefLocaleCode: LANGUAGE): Context {
            val currentLocale = getLocaleFromPrefCode(prefLocaleCode)
            val baseLocale = getLocaleFromConfiguration(baseContext.resources.configuration)
            Locale.setDefault(currentLocale)
            return if (!baseLocale.toString().equals(currentLocale.toString(), ignoreCase = true)) {
                val config = getLocalizedConfiguration(currentLocale)
                baseContext.createConfigurationContext(config)
                baseContext
            } else {
                baseContext
            }
        }

        fun applyLocalizedContext(baseContext: Context, prefLocaleCode: LANGUAGE) {
            val currentLocale = getLocaleFromPrefCode(prefLocaleCode)
            val baseLocale = getLocaleFromConfiguration(baseContext.resources.configuration)
            Locale.setDefault(currentLocale)
            if (!baseLocale.toString().equals(currentLocale.toString(), ignoreCase = true)) {
                val config = getLocalizedConfiguration(currentLocale)
                baseContext.resources.updateConfiguration(
                    config,
                    baseContext.resources.displayMetrics
                )
            }
        }

        @Suppress("DEPRECATION")
        private fun getLocaleFromConfiguration(configuration: Configuration): Locale {
            return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                configuration.locales.get(0)
            } else {
                configuration.locale
            }
        }

        fun getLocalizedResources(resources: Resources, prefLocaleCode: LANGUAGE): Resources {
            val locale = getLocaleFromPrefCode(prefLocaleCode)
            val config = resources.configuration
            @Suppress("DEPRECATION")
            config.locale = locale
            config.setLayoutDirection(locale)

            @Suppress("DEPRECATION")
            resources.updateConfiguration(config, resources.displayMetrics)
            return resources
        }


        fun getLanguageCode(language: LANGUAGE): String {
            return when (language) {
                LANGUAGE.ENGLISH -> "en"
                LANGUAGE.NEPALI -> "ne"
                LANGUAGE.SYS_DEFAULT -> "en"
            }
        }

        fun getLanguageCodeApi(language: LANGUAGE): String {
            return when (language) {
                LANGUAGE.ENGLISH -> "en"
                LANGUAGE.NEPALI -> "nep"
                else -> "en"
            }
        }

        fun getLanguageFromLangCode(lang:String?):LANGUAGE{
            return  when(lang){
                "nep" ->LANGUAGE.NEPALI
                else -> LANGUAGE.ENGLISH
            }
        }
    }


}