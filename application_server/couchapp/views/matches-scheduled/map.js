function(doc)
{
	if(doc.type == "match")
	{
		emit([doc.created_by, doc.scheduled_time], null);
		
		doc.players.forEach(function(player)
		{
			if(doc.created_by != player)
				emit([player, doc.scheduled_time], null);
		})
	}
}