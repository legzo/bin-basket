package org.elitefactory.bb;

import java.util.ArrayList;
import java.util.List;

public class Score {

	private final String playerLogin;
	private long nbOfAttempts;
	private float accuracy;
	private final List<Attempt> recentAttempts = new ArrayList<Attempt>(20);

	public Score(final String playerLogin) {
		super();
		this.playerLogin = playerLogin;
	}

	public void setAccuracy(final float accuracy) {
		this.accuracy = accuracy;
	}

	public float getAccuracy() {
		return accuracy;
	}

	public List<Attempt> getRecentAttempts() {
		return recentAttempts;
	}

	public long getNbOfAttempts() {
		return nbOfAttempts;
	}

	public void setNbOfAttempts(final long nbOfAttempts) {
		this.nbOfAttempts = nbOfAttempts;
	}

	public String getPlayerLogin() {
		return playerLogin;
	}

}
