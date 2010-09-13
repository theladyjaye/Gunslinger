function(doc)
{
	if(doc.type == "game")
		emit(doc.scheduled_time, null);
}