package org.elitefactory.bb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.codehaus.jackson.util.DefaultPrettyPrinter;
import org.elitefactory.bb.Attempt.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Path("/")
@Service
public class ScoresService {

	private static final Logger logger = LoggerFactory.getLogger(ScoresService.class);

	private static ObjectWriter prettyWriter = new ObjectMapper().writer(new DefaultPrettyPrinter());

	private final Map<String, Player> players = new HashMap<String, Player>();
	private final Map<String, List<Attempt>> attempts = new HashMap<String, List<Attempt>>();

	public ScoresService() {

		final Player charlotte = new Player("cmo", "Charlotte");
		final Player mehdi = new Player("mma", "Mehdi");
		final Player julienT = new Player("jte", "Julien T");
		final Player julienF = new Player("jfl", "Julien F");

		players.put(charlotte.getLogin(), charlotte);
		players.put(mehdi.getLogin(), mehdi);
		players.put(julienT.getLogin(), julienT);
		players.put(julienF.getLogin(), julienF);

	}

	@GET
	@Path("/players")
	@Produces("application/json")
	public String getPlayers() throws IOException {
		return prettyWriter.writeValueAsString(players);
	}

	@GET
	@Path("/scores")
	@Produces("application/json")
	public String getScores() throws IOException {
		final List<Score> scores = new ArrayList<Score>();

		for (final Player player : players.values()) {
			final Score score = new Score(player);

			final List<Attempt> attempts = getAllAttempts(player);

			final int nbOfAttempts = attempts.size();
			score.setNbOfAttempts(nbOfAttempts);

			long hits = 0;

			for (final Attempt attempt : attempts) {
				if (attempt.getResult() == Result.hit) {
					hits++;
				}
			}

			List<Attempt> lastAttempts = attempts;
			if (nbOfAttempts > 20) {
				lastAttempts = lastAttempts.subList(nbOfAttempts - 20, nbOfAttempts);
			}

			score.getRecentAttempts().addAll(lastAttempts);

			if (nbOfAttempts > 0) {
				score.setAccuracy((float) hits / nbOfAttempts);
			}

			scores.add(score);
		}

		return prettyWriter.writeValueAsString(scores);
	}

	private List<Attempt> getAllAttempts(final Player player) {
		final ArrayList<Attempt> results = new ArrayList<Attempt>();
		final List<Attempt> userAttempts = attempts.get(player.getLogin());
		if (userAttempts != null) {
			results.addAll(userAttempts);
		}
		return results;
	}

	@GET
	@Path("/attempt/{playerLogin}/{result}")
	public Response addAttempt(@PathParam("result") final Attempt.Result result,
			@PathParam("playerLogin") final String playerLogin) throws IOException {
		logger.debug("Saving attempt {} for {}", result, playerLogin);
		List<Attempt> playerAttempts = attempts.get(playerLogin);

		if (playerAttempts == null) {
			playerAttempts = new ArrayList<Attempt>();
			attempts.put(playerLogin, playerAttempts);
		}

		playerAttempts.add(new Attempt(new Date(), playerLogin, result));
		return Response.ok().build();
	}

}
