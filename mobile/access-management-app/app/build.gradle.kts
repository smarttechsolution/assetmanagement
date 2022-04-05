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

val kotlin_version: String by extra
plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("kapt")
    //  kotlin("android.extensions")
    id("dagger.hilt.android.plugin")
    id("kotlin-android")
    id("androidx.navigation.safeargs.kotlin")
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
}


android {
    compileSdkVersion(31)

    defaultConfig {
        applicationId = "com.prologic.assetManagement"
        minSdk = 21
        targetSdk = 31
        versionCode = 19
        versionName = "1.19"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }



    buildTypes {
        getByName("debug") {
             isDebuggable = true

        }
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = true
        dataBinding = true
    }

}

dependencies {

    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
    implementation(AndroidX.kotlinKtx)
     /* implementation(AndroidX.kotlinStdlib){
          exclude( group= "org.jetbrains", module= "annotations")

      }*/
    implementation(AndroidX.appcompat)
    implementation(AndroidX.constraintLayout)
    implementation(AndroidX.navigation)
    implementation(AndroidX.navigationUi)
    implementation(AndroidX.activity)
    implementation(AndroidX.fragment)
    implementation(AndroidX.recyclerView)
    implementation(AndroidX.dataStore)
    implementation(AndroidX.lifecycleLivedata)

    implementation(Extras.materialDesign)
    implementation(Extras.timber)
    implementation(Extras.circleIv)
    implementation(Extras.nepaliDatePicker)
    implementation(Network.retrofit)
    implementation(Network.gsonConverter)
    implementation(Network.loggingInterceptor)
    implementation(Network.glide)
     kapt(Network.glideAnnotation)


    implementation(platform(Firebase.firebaseBom))
    implementation(Firebase.firebaseMessaging)
    implementation(Firebase.firebaseAnalytics)
    implementation(Firebase.firebaseCrashlytics)


    implementation(Hilt.hiltAndroid)
    implementation(Hilt.hiltFragment)
    implementation("androidx.legacy:legacy-support-v4:1.0.0")
    kapt(Hilt.daggerCompiler)

    // Room components
    implementation(Room.runtime)
    implementation(Room.ktx)
    kapt(Room.compiler)

    //  kapt(Hilt.daggerCompiler)

    testImplementation(Test.junit)
    androidTestImplementation(Test.espressoCore)


}
