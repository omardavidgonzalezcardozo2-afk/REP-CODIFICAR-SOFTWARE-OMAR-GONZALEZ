# Cuestionario Semana 02

## 1. ¿Cuál es la diferencia entre FlatList y ScrollView? ¿Cuándo usar cada uno?
ScrollView renderiza todos sus hijos de una vez, estén visibles o no. FlatList
usa virtualización: solo renderiza los items visibles más un pequeño buffer, y
destruye los que salen de pantalla, lo que ahorra memoria y mejora el rendimiento.
ScrollView se usa para contenido estático o listas cortas (menos de ~20 items).
FlatList se usa para listas largas o datos dinámicos, por ejemplo los que
vienen de una API.

## 2. ¿Por qué es obligatorio keyExtractor y qué pasa si se omite?
keyExtractor devuelve un string único por item. React lo usa en la reconciliación
para identificar qué item cambió, se movió o se eliminó, y así actualizar solo
lo necesario. Si se omite (o se usa el índice), React lanza un warning en la
consola y pueden aparecer bugs: estado mezclado entre items al filtrar o
reordenar y animaciones incorrectas. Por eso se usa el id único del dato.

## 3. ¿Qué problema resuelve KeyboardAvoidingView y qué diferencia hay entre iOS y Android?
El teclado virtual aparece sobre la pantalla y puede tapar inputs y contenido.
KeyboardAvoidingView ajusta el layout para que el contenido siga visible.
En iOS se usa behavior="padding" (agrega padding inferior). En Android se usa
behavior="height" (reduce la altura del contenedor). En Android también se
puede configurar softwareKeyboardLayoutMode: "resize" en app.json.