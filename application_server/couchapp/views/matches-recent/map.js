function(doc)
{
	if(doc.type == "match" && doc.availability == "public")
		emit(doc.scheduled_time, null);
}