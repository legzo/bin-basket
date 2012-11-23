package org.elitefactory.bb;

import java.util.Date;

public class Attempt {

	private long id;

	private Date time;
	private String playerLogin;
	private Result result;

	public Attempt(final Date time, final String playerLogin, final Result result) {
		super();
		this.time = time;
		this.playerLogin = playerLogin;
		this.result = result;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(final Date time) {
		this.time = time;
	}

	public Result getResult() {
		return result;
	}

	public void setResult(final Result result) {
		this.result = result;
	}

	public long getId() {
		return id;
	}

	public void setId(final long id) {
		this.id = id;
	}

	public String getPlayerLogin() {
		return playerLogin;
	}

	public void setPlayerLogin(final String playerLogin) {
		this.playerLogin = playerLogin;
	}

	public enum Result {
		hit, miss;
	}

}
