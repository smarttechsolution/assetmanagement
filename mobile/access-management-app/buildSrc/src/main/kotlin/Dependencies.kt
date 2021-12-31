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


object Network{
    const val retrofit = "com.squareup.retrofit2:retrofit:${Versions.retrofit}"
    const val gsonConverter = "com.squareup.retrofit2:converter-gson:${Versions.retrofit}"
    const val loggingInterceptor = "com.squareup.okhttp3:logging-interceptor:${Versions.loggingInterceptor}"
    const val glide = "com.github.bumptech.glide:glide:${Versions.glide}"
    const val glideAnnotation = "com.github.bumptech.glide:compiler:${Versions.glide}"

}

object AndroidX {
    const val appcompat = "androidx.appcompat:appcompat:${Versions.appCompat}"
    const val kotlinKtx = "androidx.core:core-ktx:${Versions.ktx}"
    const val kotlinStdlib = "org.jetbrains.kotlin:kotlin-stdlib:${Versions.kotlin}"
    const val constraintLayout = "androidx.constraintlayout:constraintlayout:${Versions.constraintLayout}"
    const val dataStore = "androidx.datastore:datastore-preferences:${Versions.dataStoreVersion}"
    const val viewPager2 = "androidx.viewpager2:viewpager2:${Versions.viewPager2}"
    const val navigation = "androidx.navigation:navigation-fragment-ktx:${Versions.navigation}"
    const val navigationUi = "androidx.navigation:navigation-ui-ktx:${Versions.navigation}"
    const val activity ="androidx.activity:activity-ktx:${Versions.activity}"
    const val fragment ="androidx.fragment:fragment-ktx:${Versions.fragment}"
    const val recyclerView = "androidx.recyclerview:recyclerview:${Versions.recyclerView}"
    const val lifecycleLivedata = "androidx.lifecycle:lifecycle-livedata-ktx:${Versions.lifecycle}"
  }

object Extras {
    const val timber = "com.jakewharton.timber:timber:${Versions.timber}"
    const val circleIv = "de.hdodenhof:circleimageview:${Versions.circleImageView}"
     const val materialDesign = "com.google.android.material:material:${Versions.material}"
    const val nepaliDatePicker = "com.github.xyznaveen:pal:${Versions.nepaliDatePicker}"
}

object Hilt {
    const val hiltAndroid = "com.google.dagger:hilt-android:${Versions.hiltAndroid}"
    const val hiltFragment = "androidx.hilt:hilt-navigation-fragment:${Versions.hiltExt}"
    const val daggerCompiler = "com.google.dagger:hilt-android-compiler:${Versions.hiltAndroid}"

}

object Firebase{
    const val firebaseBom = "com.google.firebase:firebase-bom:${Versions.firebaseBom}"
    const val firebaseMessaging = "com.google.firebase:firebase-messaging"
    const val firebaseAnalytics = "com.google.firebase:firebase-analytics"
    const val firebaseCrashlytics =  "com.google.firebase:firebase-crashlytics"
}

object Room {
    const val compiler = "androidx.room:room-compiler:${Versions.room}"
    const val ktx = "androidx.room:room-ktx:${Versions.room}"
    const val runtime = "androidx.room:room-runtime:${Versions.room}"
}

object BuildPlugin {

    const val gradle = "com.android.tools.build:gradle:${Versions.gradle}"
    const val kotlinGradlePlugin = "org.jetbrains.kotlin:kotlin-gradle-plugin:${Versions.kotlin}"

    const val navigationGradlePlugin = "androidx.navigation:navigation-safe-args-gradle-plugin:${Versions.navigation}"
    const val  hiltGradlePlugin =  "com.google.dagger:hilt-android-gradle-plugin:${Versions.hiltAndroid}"
    const val firebasePlugin = "com.google.gms:google-services:${Versions.firebase}"
    const val firebaseCrashlytics = "com.google.firebase:firebase-crashlytics-gradle:2.8.0"
}

object Test{
    const val espressoCore = "androidx.test.espresso:espresso-core:${Versions.espresso}"
    const val junit = "junit:junit:${Versions.junit}"
}