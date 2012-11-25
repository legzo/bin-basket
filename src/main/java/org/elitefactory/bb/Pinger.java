package org.elitefactory.bb;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

@Component
public class Pinger {
	/**
	 * Pinging heroku app every ten minutes, night and day, everyday
	 */
	private static final String PING_CRON_EXPRESSION = "0 0/1 * * * *";
	private static final String APPLICATION_URL = "http://bin-basket.herokuapp.com";

	private static final Logger logger = LoggerFactory.getLogger(Pinger.class);

	private ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

	@PostConstruct
	public void init() {

		scheduler.initialize();

		Runnable pingTask = new Runnable() {
			@Override
			public void run() {
				logger.info("Triggering pingTask");
				pingUrl(APPLICATION_URL);
			}
		};

		scheduler.schedule(pingTask, new CronTrigger(PING_CRON_EXPRESSION));
	}

	public static void pingUrl(String urlToPing) {
		try {
			HttpClient httpClient = new DefaultHttpClient();
			HttpGet httpget = new HttpGet(urlToPing);
			HttpResponse result = httpClient.execute(httpget);
			logger.debug("Pinging {}, result {}", urlToPing, result.getStatusLine().getStatusCode());
		} catch (IOException e) {
			logger.error("Error pinging {}", e);
		}
	}
}
