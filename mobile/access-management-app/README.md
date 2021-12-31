# Asset Management Application


## Installation
Clone this repository and import into **Android Studio**
```bash
git clone git@gitlab.com:prologicsolutions/access-management-app.git
```


## Architecture
This application follows the MVVM(Model-View-ViewModel) approach along with the Repository & Single Activity Architecture
The View communicates with the ViewModel 
The ViewModel communicates with the repository to perform the necessary action 
The Repository may consist of RemoteSource for the api communication and LocalSource for local database communication

##Used Resources
[Jetpack(navigation,room,viewModel,hilt,datastore)](https://developer.android.com/jetpack?gclsrc=ds&gclsrc=ds&gclid=CLvoj8u2nPQCFUfN1AodDuYE5w)
[Firebase(crashlytics,analytics,messaging)](https://firebase.google.com/?gclsrc=ds&gclsrc=ds&gclid=CM3h0-C2nPQCFQiJjgodN_UFjQ)
[Retrofit](https://square.github.io/retrofit/)
[Timber](https://github.com/JakeWharton/timber)
[LoggingInterceptor](https://github.com/square/okhttp/tree/master/okhttp-logging-interceptor)
[Glide](https://github.com/bumptech/glide)

## Generating signed APK
From Android Studio:
1. ***Build*** menu
2. ***Generate Signed APK...***
3. Fill in the keystore information *(you only need to do this once manually and then let Android Studio remember it)*


## Contributing

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Run the linter (ruby lint.rb').
5. Push your branch (git push origin my-new-feature)
6. Create a new Pull Request