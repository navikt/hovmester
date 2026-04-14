# OWASP Top 10 — Kotlin/Spring-eksempler

Eksempler på de vanligste OWASP Top 10-kategoriene i en Nav-kontekst.

## A01: Broken Access Control

```kotlin
// ✅ Sjekk at bruker har tilgang til ressursen
@GetMapping("/api/vedtak/{id}")
fun getVedtak(@PathVariable id: UUID): ResponseEntity<VedtakDTO> {
    val bruker = hentInnloggetBruker()
    val vedtak = vedtakService.findById(id)
    if (vedtak.brukerId != bruker.id) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
    }
    return ResponseEntity.ok(vedtak.toDTO())
}

// ❌ Ingen tilgangskontroll (IDOR)
@GetMapping("/api/vedtak/{id}")
fun getVedtak(@PathVariable id: UUID) = vedtakService.findById(id)
```

## A03: Injection

```kotlin
// ✅ Parameterisert spørring
jdbcTemplate.query("SELECT * FROM bruker WHERE fnr = ?", mapper, fnr)

// ❌ String-sammenslåing
jdbcTemplate.query("SELECT * FROM bruker WHERE fnr = '$fnr'", mapper)
```

## A05: Security Misconfiguration

```kotlin
// ✅ CORS kun for kjente domener
@Bean
fun corsFilter() = CorsFilter(CorsConfiguration().apply {
    allowedOrigins = listOf("https://my-app.intern.nav.no")
    allowedMethods = listOf("GET", "POST")
})

// ❌ Åpen CORS
allowedOrigins = listOf("*")
```

## A07: Cross-Site Scripting (XSS)

```tsx
// ✅ React escaper automatisk
<BodyShort>{bruker.navn}</BodyShort>

// ❌ Raw HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## Filopplasting

```kotlin
// ✅ Valider filtype, størrelse og magic bytes
fun validateUpload(file: MultipartFile) {
    require(file.size <= 10 * 1024 * 1024) { "Fil for stor (maks 10 MB)" }
    require(file.contentType in ALLOWED_TYPES) { "Ugyldig filtype" }
    val bytes = file.bytes.take(8).toByteArray()
    require(verifyMagicBytes(bytes, file.contentType!!)) { "Filinnhold matcher ikke type" }
}
```
