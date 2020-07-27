# pncl-demo API

pncl-demo API hosted at: http://pncl-demo.uc.r.appspot.com/

### Endpoints
_______

**UNAUTHENTICATED**
* `login/:username/:password` - creates new user, rejects incorrect username/password, returns token on success. Implementation does not return errors for short endpoint paths like `login/:username`, for which the endpoint won't be found.
* `/_ah/warmup` used to keep single instance warm and prevent cold starts. "Knocks" firestore to prevent latency on calls to `/login` which uses firestore.
 
**AUTHENTICATED**
* `/parse/:url` returns Response: { “title”: “”, “favicon”: “”, “large-image”: “”, “snippet”: “” }, according to parsed: title, favicons, large-images, description (for snippet). Returns empty string if not found.
* `/translate/:url` - requires `targetLanguageCode` in json body from supported languages found [here](https://cloud.google.com/translate/docs/languages). Discovers language automatically and uses long-running process to translate the html. The returned html is raw and may lack styling (css) from original web page load.
* `/upload` - returns Response: { url: signedUrl, id: unique_identifier }. This identifier can be used to retrieve using the `/download` endpoint below.
* `/download` - downloads file if it exists, returns error if not found.

Notes:
* Ensure to encode urls sent to `parse/:url` and `translate/:url` endpoints.
