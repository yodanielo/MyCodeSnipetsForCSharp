echo off
set nombre=%1
ildasm /all /out=%nombre%.il %nombre%.dll
sn -k %nombre%_firma.snk
ilasm /dll /key=%nombre%_firma.snk %nombre%.il
echo "Listo..."
@pause