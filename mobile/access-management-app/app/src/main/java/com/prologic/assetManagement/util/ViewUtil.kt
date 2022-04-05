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

import android.app.Activity
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.BitmapFactory
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.text.Editable
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.TextWatcher
import android.text.style.ImageSpan
import android.view.Gravity
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.DatePicker
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.google.android.material.datepicker.CalendarConstraints
import com.google.android.material.datepicker.MaterialDatePicker
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.prologic.assetManagement.AppNavigationDirections
import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.LANGUAGE
import np.com.naveenniraula.ghadi.Pal
import np.com.naveenniraula.ghadi.data.GhadiResult
import np.com.naveenniraula.ghadi.listeners.DatePickCompleteListener
import np.com.naveenniraula.ghadi.miti.DateUtils
import np.com.naveenniraula.ghadi.ui.CalendarDialogFragment
import timber.log.Timber
import java.io.*
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

fun Fragment.showToast(message: String?, duration: Int = Toast.LENGTH_SHORT) {
    message?.let {
        Toast.makeText(context, it, duration).show()
    }
}

fun Fragment.showToast(message: Int, duration: Int = Toast.LENGTH_SHORT) {
    message?.let {
        Toast.makeText(context, it, duration).show()
    }
}

fun Context.showNoConnectionErrorDialog() {
    MaterialAlertDialogBuilder(this, R.style.MaterialAlertDialog)
        .setTitle(getString(R.string.error_no_internet))
        .setMessage(getString(R.string.error_no_internet_message))
        .setNeutralButton(getString(R.string.action_close)) { dialog, which ->
            dialog.dismiss()
        }
        .show()
}

fun View.show() {
    visibility = View.VISIBLE
}

fun View.invisible() {
    visibility = View.INVISIBLE
}

fun View.hide() {
    visibility = View.GONE
}

fun Fragment.showProgressDialog(loadTitle: String) {
    findNavController().navigate(AppNavigationDirections.actionGlobalShowProgressDialog(loadTitle))
}

fun Fragment.hideProgressDialog() {
    //  if(findNavController().currentDestination?.id == R.id.dialogFragmentAddCashbook)
    findNavController().popBackStack()
}

fun Context.hideKeyboardFrom(view: View) {
    val imm: InputMethodManager =
        this.getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
    imm.hideSoftInputFromWindow(view.windowToken, 0)
}

fun TextView.setAmount(amount: Double) {
    val formattedAmount = NumberFormat.getNumberInstance(Locale.getDefault()).format(amount)
    text = context.getString(R.string.extra_rs) + " $formattedAmount"
}

fun TextView.setAmount(amount: String) {
    text = context.getString(R.string.extra_rs) + " $amount"
}


fun TextView.setEstimatedCost(amount: Double) {
    text = " $amount"
}

fun TextView.setRiskScore(score: String) {
    val number = NumberFormat.getNumberInstance(Locale.getDefault()).parse(score).toInt()
    val scoreInt = (number * 10)
    when {
        scoreInt <= 20 -> {
            backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFD634"))
            text = "$score," + context.getString(R.string.score_low)
        }
        scoreInt in 21..50 -> {
            backgroundTintList = ColorStateList.valueOf(Color.parseColor("#00FF00"))
            text = "$score," + context.getString(R.string.score_min)
        }
        scoreInt in 51..80 -> {
            backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FF7927"))
            text = "$score," + context.getString(R.string.score_mid)
        }
        else -> {
            backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FF4D4D"))
            text = "$score," + context.getString(R.string.score_high)
        }
    }

}

fun TextView.setInterval(interval: String) {
    text = " $interval "
}

fun TextView.showCursor(input: String) {
    val sb = SpannableStringBuilder("$input")
    val imageSpan = ImageSpan(context, R.drawable.ic_calendar)
    sb.setSpan(imageSpan, sb.length, sb.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    text = sb


}

fun Activity.setUpLanguage(lang: String) {
    val config = resources.configuration
    val locale = Locale(lang)
    Locale.setDefault(locale)
    config.setLocale(locale)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N)
        createConfigurationContext(config)

    resources.updateConfiguration(config, resources.displayMetrics)

}

fun Fragment.showDatePicker(onDateSet: (String) -> Unit) {
    when (AssetManagementApp.sysLanguage) {
        LANGUAGE.NEPALI -> {
            Pal.Builder(childFragmentManager)
                .fromEnglish(System.currentTimeMillis())
                .setBackgroundColor(Color.parseColor("#0098DA"))
                .setForegroundColor(ContextCompat.getColor(requireContext(), android.R.color.white))
                .withCallback(object : DatePickCompleteListener {
                    override fun onDateSelectionCancelled(result: GhadiResult) {
                        TODO("Not yet implemented")
                    }

                    override fun onDateSelectionComplete(result: GhadiResult) {
                        val year = result.bsYear
                        val month = result.bsMonth
                        val day = result.bsDay
                        val date = "$year-$month-$day"
                        onDateSet(date)

                    }

                }).build().show(childFragmentManager, "nepaliDatePicker")

        }
        else -> {
            val picker = MaterialDatePicker.Builder.datePicker()
                .setSelection(MaterialDatePicker.todayInUtcMilliseconds())
                .setTitleText("Select date")
                .build()
            picker.addOnPositiveButtonClickListener {
                val selectedDate = Date(it)
                onDateSet(selectedDate.getServerDateFormat())

            }
            picker.addOnCancelListener {
                picker.dismiss()
            }
            picker.show(childFragmentManager, "englishDatePicker")
        }
    }
}


fun EditText.afterTextChanged(afterTextChanged: (String) -> Unit) {
    this.addTextChangedListener(object : TextWatcher {
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        }

        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        }

        override fun afterTextChanged(editable: Editable?) {
            afterTextChanged.invoke(editable.toString())
        }
    })
}

fun TextView.toFlagEmoji(countryCode: String) {
    Timber.d("inside to flag")
    val emoji = countryCode.uppercase(Locale.US)
        .map { char ->
            Character.codePointAt("$char", 0) - 0x41 + 0x1F1E6
        }
        .map { codePoint ->
            Character.toChars(codePoint)
        }
        .joinToString(separator = "") { charArray ->
            String(charArray)
        }
    Timber.d("the emoji is:" + emoji)
    text = emoji + " " + countryCode

}


