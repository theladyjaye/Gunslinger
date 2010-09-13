function(doc)
{
	if(doc.type == "match")
		emit(doc.scheduled_time, null);
}