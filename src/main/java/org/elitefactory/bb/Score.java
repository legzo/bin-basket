package org.elitefactory.bb;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class Score {

	private final String playerLogin;
	private final String playerName;
	private long nbOfAttempts;
	private float recentAccuracy;
	private float accuracy;
	private final List<Attempt> recentAttempts = new ArrayList<Attempt>(20);
	private Map<Integer, Float> accuracies = new TreeMap<Integer, Float>();

	public Map<Integer, Float> getAccuracies() {
		return accuracies;
	}

	public void setAccuracies(Map<Integer, Float> accuracies) {
		this.accuracies = accuracies;
	}

	public Score(final Player player) {
		super();
		playerLogin = player.getLogin();
		playerName = player.getDisplayName();
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

	public String getPlayerName() {
		return playerName;
	}

	public float getRecentAccuracy() {
		return recentAccuracy;
	}

	public void setRecentAccuracy(float recentAccuracy) {
		this.recentAccuracy = recentAccuracy;
	}

}
