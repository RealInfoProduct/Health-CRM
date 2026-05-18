import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material
import { MaterialModule } from './material.module';

// Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

// Pipes
import { FilterPipe } from './pipe/filter.pipe';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// Scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// 🔥 FIREBASE COMPAT (IMPORTANT)
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// ================= Translate Factory =================
export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

const firebaseConfig = {
  apiKey: "AIzaSyCa-sJYnvvqqAX8rKPubwBLFQIEec86XVw",
  authDomain: "health-clinic-aba2e.firebaseapp.com",
  projectId: "health-clinic-aba2e",
  storageBucket: "health-clinic-aba2e.appspot.com",
  messagingSenderId: "176073196111",
  appId: "1:176073196111:web:ed809ab9aecfa3f25a603a",
  measurementId: "G-KY56LB7H7R"
};

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    FilterPipe
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MaterialModule,

    TablerIconsModule.pick(TablerIcons),

    NgScrollbarModule,

    FullComponent,

    // ================= TRANSLATE =================
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    // ================= FIREBASE INIT (FIXED) =================
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],

  exports: [TablerIconsModule],

  bootstrap: [AppComponent]
})
export class AppModule {}