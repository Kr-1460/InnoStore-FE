import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the InnoStore client base API path
 */
export const BASE_PATH_INNOSTORE = new InjectionToken<string>('BASE_PATH_INNOSTORE', {
    providedIn: 'root',
    factory: () => 'http://localhost:8080', // Default fallback
});
/**
 * Injection token for the InnoStore client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_INNOSTORE = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_INNOSTORE', {
    providedIn: 'root',
    factory: () => [], // Default empty array
});
/**
 * HttpContext token to identify requests belonging to the InnoStore client
 */
export const CLIENT_CONTEXT_TOKEN_INNOSTORE = new HttpContextToken<string>(() => 'InnoStore');
