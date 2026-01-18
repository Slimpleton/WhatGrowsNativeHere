import { Injectable } from '@angular/core';
import { TranslocoLoader, Translation } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    constructor(
        private readonly _http: HttpClient,
    ) { }

    public getTranslation(lang: string) {
        return this._http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}
