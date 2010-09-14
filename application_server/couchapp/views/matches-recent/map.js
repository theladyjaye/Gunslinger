function(doc)
{
	if(doc.type == "match" && doc.public == true)
		emit(doc.scheduled_time, null);
}