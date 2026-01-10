import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Translation, TranslocoLoader } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { iif, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private readonly _http = inject(HttpClient);
    private readonly _platformId = inject(PLATFORM_ID);

    public getTranslation(lang: string): Observable<Translation> {
        return iif(
            () => isPlatformBrowser(this._platformId),
            this._http.get<Translation>(`/assets/i18n/${lang}.json`),
            of<Translation>({})
        );
    }
}
