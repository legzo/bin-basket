package org.elitefactory.bb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Path("/")
@Service
public class ScoresService {

	private static final int NB_OF_RECENT_ATTEMPTS = 30;

	private static final Logger logger = LoggerFactory.getLogger(ScoresService.class);

	private static ObjectWriter prettyWriter = new ObjectMapper().writer(new DefaultPrettyPrinter());

	@Autowired
	private AttemptsDao attemptsDao;

	public ScoresService() {

	}

	@GET
	@Path("/players")
	@Produces("application/json")
	public String getPlayers() throws IOException {
		List<Player> players = attemptsDao.getPlayers();

		return prettyWriter.writeValueAsString(players);
	}

	@GET
	@Path("/scores")
	@Produces("application/json")
	public String getScores() throws IOException, InterruptedException {
		final List<Score> scores = new ArrayList<Score>();
		List<Player> players = attemptsDao.getPlayers();

		for (final Player player : players) {
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

			if (nbOfAttempts > 0) {
				score.setAccuracy((float) hits / nbOfAttempts);
			}

			int nbOfRecentAttempts = nbOfAttempts;

			List<Attempt> lastAttempts = attempts;
			if (nbOfAttempts > NB_OF_RECENT_ATTEMPTS) {
				lastAttempts = lastAttempts.subList(nbOfAttempts - NB_OF_RECENT_ATTEMPTS, nbOfAttempts);
				nbOfRecentAttempts = NB_OF_RECENT_ATTEMPTS;
			}

			long recentHits = 0;

			for (final Attempt attempt : lastAttempts) {
				if (attempt.getResult() == Result.hit) {
					recentHits++;
				}
			}

			score.getRecentAttempts().addAll(lastAttempts);

			if (nbOfRecentAttempts > 0) {
				score.setRecentAccuracy((float) recentHits / nbOfRecentAttempts);
			}

			scores.add(score);
		}

		return prettyWriter.writeValueAsString(scores);
	}

	private List<Attempt> getAllAttempts(final Player player) {
		final ArrayList<Attempt> results = new ArrayList<Attempt>();

		final List<Attempt> userAttempts = attemptsDao.getPlayerAttempts(player);

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

		Attempt attempt = new Attempt(new Date(), playerLogin, result);
		attemptsDao.saveAttempt(attempt);

		return Response.ok().build();
	}

	@GET
	@Path("/createPlayer/{login}/{displayName}")
	public Response addAttempt(@PathParam("login") final String login,
			@PathParam("displayName") final String displayName) throws IOException {
		logger.debug("Creating new player {} {}", login, displayName);

		Player player = new Player(login, displayName);
		attemptsDao.savePlayer(player);

		return Response.ok().build();
	}

	@GET
	@Path("/clearAll")
	public Response clearAll() throws IOException {
		logger.debug("Clearing everything");

		return Response.ok().build();
	}

}
