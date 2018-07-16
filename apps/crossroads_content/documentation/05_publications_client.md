*Understanding PublicationsClient*

This is a portion of the CrossroadsContent project that was deprecated before the
deprecation of the Maestro project as a whole. It is kept here for reference, but
serves no functionality within the project as it stands today.

Simply put, this code communicated with a C# API endpoint and was responsible for
formatting the response for consumption by the CrossroadsInterface project.
Specifically it was responsible for getting articles and well as a single article by
id and source. Architecture then changed around this desired functionality and the
PublicationsClient was abandoned.
