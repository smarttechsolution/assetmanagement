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


import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.auth.data.LANGUAGE
import np.com.naveenniraula.ghadi.miti.DateUtils
import timber.log.Timber
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*


val simpleDateFormat = SimpleDateFormat("yyyy/MM/dd")
val serverDateFormat = SimpleDateFormat("yyyy-MM-dd", LocaleUtil.getLocaleFromSystem())
val monthYearFormat = SimpleDateFormat("MMMM, yyyy", LocaleUtil.getLocaleFromSystem())
val monthOnlyFormat = SimpleDateFormat("MM", LocaleUtil.getLocaleFromSystem())
val monthNameOnlyFormat = SimpleDateFormat("MMMM", LocaleUtil.getLocaleFromSystem())
val yearOnlyFormat = SimpleDateFormat("yyyy", LocaleUtil.getLocaleFromSystem())
val cashbookFormatDate = SimpleDateFormat("dd MMM. yy", LocaleUtil.getLocaleFromSystem())
val cashbookWeekFormat = SimpleDateFormat("EEE dd", LocaleUtil.getLocaleFromSystem())

val language = AssetManagementApp.sysLanguage

fun getMonthAndYear(): String {
    val calendar = Calendar.getInstance()
    return when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = Date().getMittiDate()
            val month = DateUtils.getMonthName(mittiDate.month)
            val year = mittiDate.year
            val today = "$month $year"
            today
        }
        else -> {
            monthYearFormat.format(calendar.time)
        }
    }
}

fun Date.getMittiDate(): np.com.naveenniraula.ghadi.miti.Date {
    val calendar = Calendar.getInstance()
    calendar.time = this
    val mittiDate = np.com.naveenniraula.ghadi.miti.Date(calendar).convertToNepali()
    return mittiDate
}

fun Date.getMonthOnly(): String {
    Timber.d("the date is:" + this)
    return when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = this.getMittiDate()
            val month = mittiDate.month.toString()
            var monthWithZero = if (month.length == 1)
                "0$month"
            else
                month
            val date = "$monthWithZero"
            date
        }
        else -> {
            val formattedDate = monthOnlyFormat.format(this)
            return formattedDate
        }
    }
}

fun Date.yearOnly(): String {
    Timber.d("the date is:" + this)
    return when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = this.getMittiDate()
            val year = mittiDate.year
            val date = "$year"
            date
        }
        else -> {
            val formattedDate = yearOnlyFormat.format(this)
            return formattedDate
        }
    }
}


fun Date.getServerDateFormat(): String {
    return when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = this.getMittiDate()
            val day = mittiDate.day
            val month = mittiDate.month
            val year = mittiDate.year
            val date = "$year-$month-$day"
            return date
        }
        else -> {
            return serverDateFormat.format(this)
        }
    }

}

fun Date.getWeekFormatDate(): String {

    return return when (language
    ) {
        LANGUAGE.NEPALI -> {
            val mittiDate = this.getMittiDate()
            val weekDay = DateUtils.getDayName(mittiDate.weekDayNum)
            val day = mittiDate.day
            val format = "$weekDay $day"
            format
        }
        else -> {
            cashbookWeekFormat.format(this)
        }
    }


}


fun getMonthNameFromMonth(month: Int): String {
    return when (language) {
        LANGUAGE.NEPALI -> {
            val month = DateUtils.getMonthName(month)
            return month
        }
        else -> {
            val month = DateUtils.getMonthNameAd(month)
            return month
        }
    }

}

fun getCurrentMonthOnly(): String {
    return when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = Date().getMittiDate()
            val month = mittiDate.month.toString()
            var monthWithZero = if (month.length == 1)
                "0$month"
            else
                month
            return monthWithZero
        }
        else -> {
            return monthOnlyFormat.format(Date())
        }
    }


}

fun getCurrentYearOnly(): String {
    return when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = Date().getMittiDate()
            val year = mittiDate.year
            return year.toString()
        }
        else -> {
            return yearOnlyFormat.format(Date())
        }
    }

}

fun getDateFromYearAndMonth(year: String, month: String): Date {
    val calender = Calendar.getInstance()
    when (language) {
        LANGUAGE.NEPALI -> {
            val mittiDate = np.com.naveenniraula.ghadi.miti.Date(year.toInt(), month.toInt(), 1)
            val date = DateUtils.getEnglishDate(mittiDate)
            calender.set(Calendar.YEAR, date.year)
            calender.set(Calendar.MONTH, date.month)
            return calender.time
        }
        else -> {
            calender.set(Calendar.YEAR, year.toInt())
            calender.set(Calendar.MONTH, month.toInt())
            return calender.time
        }
    }

}

fun Date.getCurrentWeekRange(): List<String> {
    val days = mutableListOf<String>()
    val calendar = Calendar.getInstance()
    calendar.time = this
    calendar.firstDayOfWeek = Calendar.SUNDAY
    calendar[Calendar.DAY_OF_WEEK] = Calendar.SUNDAY
    for (i in 0..6) {
        days.add(calendar.time.getServerDateFormat())
        calendar.add(Calendar.DAY_OF_MONTH, 1)
    }
    return days
}





