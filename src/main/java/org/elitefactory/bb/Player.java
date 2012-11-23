package org.elitefactory.bb;

public class Player {

	private long id;

	private String login;
	private String displayName;

	public Player(final String login, final String displayName) {
		super();
		this.login = login;
		this.displayName = displayName;
	}

	public long getId() {
		return id;
	}

	public void setId(final long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(final String login) {
		this.login = login;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(final String displayName) {
		this.displayName = displayName;
	}

}
