for f in dest1/posts/2013/*/*.html
do
   echo $f

   
   RET=`sed -e 'N; N; N; s/\(<\/div>\n<\/body>\n<\/html>$\)/<>\1/' $f`
   echo $RET
   echo ret=$?
done
