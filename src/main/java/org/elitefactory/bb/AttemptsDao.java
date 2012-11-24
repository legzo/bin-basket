package org.elitefactory.bb;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AttemptsDao {

	@PersistenceContext
	private EntityManager em;

	@Transactional
	public void saveAttempt(Attempt attempt) {
		em.persist(attempt);
	}

	@Transactional
	public void savePlayer(Player player) {
		em.persist(player);
	}

	@SuppressWarnings("unchecked")
	public List<Attempt> getPlayerAttempts(Player player) {
		return em.createQuery("select attempt from Attempt attempt where attempt.playerLogin = :login")
				.setParameter("login", player.getLogin()).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Player> getPlayers() {
		return em.createQuery("select player from Player player").getResultList();
	}

}
