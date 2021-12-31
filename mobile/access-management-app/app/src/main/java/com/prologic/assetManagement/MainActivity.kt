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

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.net.NetworkInfo
import android.os.Bundle
import androidx.activity.viewModels
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavController
import androidx.navigation.NavDestination
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.prologic.assetManagement.auth.data.AuthStore
import com.prologic.assetManagement.auth.data.AuthStoreEntryPoint
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.auth.data.MainViewModel
import com.prologic.assetManagement.databinding.ActivityMainBinding
import dagger.hilt.android.AndroidEntryPoint
import dagger.hilt.android.EntryPointAccessors
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.util.*
import android.net.ConnectivityManager
import android.net.Network
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import timber.log.Timber
import android.net.NetworkCapabilities
import android.os.Build
import com.prologic.assetManagement.util.*

/**
 * Main activity which has Navhost to show multiple fragments
 */
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val mainViewModel: MainViewModel by viewModels()

    private lateinit var oldPrefLocaleCode: LANGUAGE


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        createNotificationChannel()
        setSupportActionBar(binding.toolbar)
        resetTitle()

        val navView: BottomNavigationView = binding.navView

        val storage = Storage(applicationContext)
        val lang: LANGUAGE = storage.getPreferredLocale()
        when (lang) {
            LANGUAGE.NEPALI -> {
                binding.tvLanguage.toFlagEmoji("US")
            }
            else -> binding.tvLanguage.toFlagEmoji("NP")
        }

        binding.tvLanguage.setOnClickListener {
            when (lang) {
                LANGUAGE.NEPALI -> updateAppLocale(LANGUAGE.ENGLISH)
                else -> updateAppLocale(LANGUAGE.NEPALI)
            }

        }


        val navHostFragment = supportFragmentManager.findFragmentById(
            R.id.nav_host_fragment_activity_main
        ) as NavHostFragment
        val navGraphInflater = navHostFragment.navController.navInflater
        val navGraph = navGraphInflater.inflate(R.navigation.app_navigation)
        val navController = navHostFragment.navController
        onNavDestinationSelected(navController)
        mainViewModel.isLoggedIn.observe(this, Observer {
            it?.let {
                if (it.isLoggedIn) {
                    navGraph.setStartDestination(R.id.fragmentLogin)

                } else {
                    binding.tvUserName.text = it.userName
                    title = getString(R.string.title_cashbook)
                    navGraph.setStartDestination(R.id.main_navigation)
                    val appBarConfiguration = AppBarConfiguration(
                        setOf(
                            R.id.navigation_cashbook,
                            R.id.navigation_maintenance,
                            R.id.navigation_service
                        )
                    )
                    binding.toolbar.setupWithNavController(navController, appBarConfiguration)
                    navView.setupWithNavController(navController)

                }
                navController.graph = navGraph
            }
        })

        binding.btnNotifications.setOnClickListener {
            navController.navigate(R.id.fragmentNotification)
        }

        mainViewModel.connection.observe(this, Observer {
            if (!it) {
                MaterialAlertDialogBuilder(this)
                    .setTitle("NO internet")
                    .setMessage("Please be connected to the internet to use the app")
                    .setPositiveButton("OKAAY") { dialog, which ->
                        // Respond to positive button press
                    }

                    .show()
            } else {

            }
        })

        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
    }

    /** to hide the bottom navigation in the Login and showing it while other destinations are selected
     */
    private fun onNavDestinationSelected(navController: NavController) {
        navController.addOnDestinationChangedListener { controller, destination, arguments ->
            when (destination.id) {
                R.id.fragmentLogin -> {
                    binding.navView.hide()
                    supportActionBar?.hide()
                }
                else -> {
                    binding.navView.show()
                    supportActionBar?.show()
                }
            }
        }

    }

    /**
     * reset title when the app language is changed
     */
    private fun resetTitle() {
        try {
            val label =
                packageManager.getActivityInfo(componentName, PackageManager.GET_META_DATA).labelRes
            if (label != 0) {
                setTitle(label)
            }
        } catch (e: PackageManager.NameNotFoundException) {
        }
    }


    override fun attachBaseContext(newBase: Context) {
        oldPrefLocaleCode = Storage(newBase).getPreferredLocale()
        applyOverrideConfiguration(LocaleUtil.getLocalizedConfiguration(oldPrefLocaleCode))
        super.attachBaseContext(newBase)

    }


    private fun updateAppLocale(language: LANGUAGE) {
        AssetManagementApp.userPreference = language
        Storage(applicationContext).setPreferredLocale(language)
        LocaleUtil.applyLocalizedContext(applicationContext, language)
        finish()
        startActivity(intent)
        overridePendingTransition(0, 0)
        //recreate() //locale is changed, restart the activty to update

    }

    /**
     * To receive the push notification
     */
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val descriptionText = BuildConfig.APPLICATION_ID + "NotificationChannelDescription"

            val importance = NotificationManager.IMPORTANCE_DEFAULT

            val highImportance = NotificationManager.IMPORTANCE_HIGH
            val messageChannel = NotificationChannel(
                getString(R.string.default_notification_channel_id),
                descriptionText,
                highImportance
            )
            messageChannel.enableVibration(true)

            // Register the channel with the system
            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(messageChannel)
        }

    }


}